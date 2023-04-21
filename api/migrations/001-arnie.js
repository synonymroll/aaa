const {nanoid} = require('nanoid');

const arnies = [
  {
    name: 'John Matrix',
    kill_count: 130,
    kills: [
      {
        bad_guy: 'Bennett',
        weapon: 'Steam pipe',
        one_liner: 'Let off some steam, Bennett',
      },
      {
        bad_guy: 'Sully',
        weapon: 'Gravity',
        one_liner: 'I lied',
      },
      {
        bad_guy: 'Cooke',
        weapon: 'Table leg',
        one_liner: null,
      },
      {
        bad_guy: 'Arius',
        weapon: 'Shotgun',
        one_liner: null,
      },
    ],
  },
  {
    name: 'Harry Tasker',
    kill_count: 87,
    kills: [
      {
        bad_guy: 'Aziz',
        weapon: 'Missile',
        one_liner: `You're fired`,
      },
      {
        bad_guy: 'Terrorist',
        weapon: 'Scalpel',
        one_liner: null,
      },
      {
        bad_guy: 'Terrorist',
        weapon: 'Meat hook',
        one_liner: null,
      },
    ],
  },
  {
    name: 'Douglas Quaid',
    kill_count: 67,
    kills: [
      {
        bad_guy: 'Lori',
        weapon: 'Pistol',
        one_liner: 'Consider that a divorce',
      },
      {
        bad_guy: 'Richter',
        weapon: 'Elevator',
        one_liner: 'See you at the party, Richter',
      },
      {
        bad_guy: 'Benny',
        weapon: 'Drill',
        one_liner: null,
      },
      {
        bad_guy: 'Vilos Cohaagen',
        weapon: 'Mars',
        one_liner: null,
      },
    ],
  },
  {
    name: 'Ben Richards',
    kill_count: 14,
    kills: [
      {
        bad_guy: 'Subzero',
        weapon: 'Barbed wire',
        one_liner: 'Here is Subzero; now plain zero',
      },
      {
        bad_guy: 'Buzzsaw',
        weapon: 'Chainsaw',
        one_liner: `That's alright, keep it`,
      },
    ],
  },
];

exports.up = async function(sql) {
  await sql`CREATE EXTENSION pg_trgm`;

  await sql`
    CREATE TABLE arnie (
      id text PRIMARY KEY,
      name text NOT NULL,
      kill_count integer NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz DEFAULT current_timestamp
    )
  `;
  await sql`
    CREATE TABLE kill (
      id integer NOT NULL,
      arnie_id text NOT NULL,
      bad_guy text NOT NULL,
      weapon text NOT NULL,
      one_liner text,
      FOREIGN KEY (arnie_id) REFERENCES arnie (id)
    )
  `;

  await sql`CREATE INDEX arnie_name_idx ON arnie (name)`;
  await sql`CREATE INDEX arnie_kill_count_idx ON arnie (kill_count)`;
  await sql`CREATE INDEX arnie_created_at_idx ON arnie (created_at)`;
  await sql`CREATE INDEX arnie_updated_at_idx ON arnie (updated_at)`;
  await sql`CREATE INDEX kill_arnie_idx ON kill (arnie_id)`;
  await sql`CREATE UNIQUE INDEX kill_id_arnie_id ON kill (id, arnie_id)`;

  const now = new Date();
  const killData = [];
  const arnieData = arnies.map(({kills, ...arnie}) => {
    const id = nanoid();
    killData.push(...kills.map((kill, i) => ({id: i, arnie_id: id, ...kill})));
    return {id, created_at: now, ...arnie};
  });

  await sql`INSERT INTO arnie ${sql(arnieData)}`;
  await sql`INSERT INTO kill ${sql(killData)}`;
};

exports.down = async function(sql) {
  await sql`DROP TABLE kill`;
  await sql`DROP TABLE arnie`;
  await sql`DROP EXTENSION pg_trgm`;
};
