const postgres = require('postgres');

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  transform: postgres.camel,
  debug: true,
});

const orderBy = fields => fields.reduce(
  (acc, field, i) => {
    const desc = field.charAt(0) === '-';
    const order = desc ? sql`${sql(field.slice(1))} DESC` : sql`${sql(field)}`;
    return sql`${acc} ${i ? sql`,` : sql`ORDER BY`} ${order}`;
  },
  sql``
);

module.exports = {
  orderBy,
  sql,
};
