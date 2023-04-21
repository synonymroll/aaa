const createError = require('http-errors');
const {isNull, omitBy} = require('lodash');
const {orderBy, sql} = require('../db');

const modelToDto = ({createdAt, updatedAt, ...props}) => ({
  ...props,
  createdAt: createdAt.toISOString(),
  updatedAt: createdAt.toISOString(),
});

const getArnieById = async (c, ctx) => {
  const {id} = c.request.params;
  const rs = await sql`
    SELECT
      a.*, k.bad_guy, k.one_liner, k.weapon
    FROM arnie AS a
    LEFT JOIN kill as k
    ON a.id = k.arnie_id
    WHERE a.id = ${id}
    ORDER BY k.id
  `;
  if (!rs.length) {
    throw createError(404);
  }

  const arnie = rs.reduce((acc, row) => {
    const {badGuy, oneLiner, weapon, ...arnie} = row;
    const kill = omitBy({badGuy, oneLiner, weapon}, isNull);
    return Object.assign(acc, arnie, {
      kills: (acc.kills || []).concat(kill),
    });
  }, {});
  ctx.body = modelToDto(arnie);
};

const listArnies = async (c, ctx) => {
  const {
    page = 1,
    pageSize = 20,
    sort = [],
  } = c.request.query;
  const offset = (page - 1) * pageSize;
  const query = sql`
    SELECT
      id, name, kill_count, created_at, updated_at
    FROM arnie
      ${orderBy([].concat(sort))}
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;
  const totalQuery = sql`
    SELECT count(*) FROM arnie
  `;
  const [data, count] = await Promise.all([query, totalQuery]);
  const total = +count[0].count;
  const lastPage = 1 + Math.floor(total / +pageSize);
  ctx.body = {
    meta: {
      currentPage: +page,
      lastPage,
      pageSize: +pageSize,
      total,
    },
    data: data.map(modelToDto),
  };
};

const putArnieById = async (c, ctx) => {
  const {id: arnieId} = c.request.params;
  const {kills, ...arnie} = c.request.body;
  const killData = kills.map((kill, i) => ({
    ...kill,
    id: i,
    arnieId,
  }));
  const [row] = await sql`SELECT 1 AS count FROM arnie WHERE id=${arnieId}`;
  if (!row) {
    throw createError(404);
  }

  await sql.begin(async sql => {
    await sql`
      INSERT INTO kill ${sql(killData)}
      ON CONFLICT (id, arnie_id)
      DO UPDATE SET
        bad_guy = EXCLUDED.bad_guy, one_liner = EXCLUDED.one_liner, weapon = EXCLUDED.weapon
    `;
    await sql`
      DELETE FROM kill WHERE arnie_id = ${arnieId} AND id >= ${kills.length}
    `;
    const [row] = await sql`
      UPDATE arnie
      SET ${sql(arnie)}
      WHERE id = ${arnieId}
      RETURNING created_at, updated_at`;
    ctx.body = modelToDto({
      id: arnieId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  });
};

module.exports = {
  getArnieById,
  listArnies,
  putArnieById,
};
