import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDB'});

db.execute('PRAGMA journal_mode = MEMORY;'); // or OFF

const C_INSERT = 1000;
const C_SELECT = 100;

const SQL_CREATE = `CREATE TABLE IF NOT EXISTS test (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT
);`;

const SQL_DROP = 'DROP TABLE IF EXISTS test';

const SQL_INSERT =
  "INSERT INTO test (name, description) VALUES ('Some Name', 'Ut culpa sit commodo laboris. Ad commodo consequat proident exercitation excepteur. Do fugiat enim proident officia tempor duis ut. Elit enim non consectetur consectetur ex officia pariatur duis fugiat id velit eu amet. Nostrud labore ad nisi cupidatat occaecat cillum eiusmod culpa minim in velit.Id non sit non consequat aliqua ex non proident aliqua nulla incididunt minim. Ea pariatur nostrud et duis laborum laboris voluptate amet officia sint sit. Deserunt exercitation adipisicing excepteur mollit nostrud exercitation do laborum elit sit nulla. Nulla mollit eu Lorem est in laborum non. Do pariatur consectetur Lorem amet cillum ullamco non nisi amet mollit Lorem dolore.Cillum dolor occaecat proident amet amet officia exercitation proident eu nulla. Ipsum dolore anim magna ut nulla. Voluptate cupidatat excepteur non aliqua qui eiusmod.Minim sint in pariatur dolor incididunt consectetur velit exercitation exercitation voluptate commodo. Ipsum ad voluptate occaecat mollit minim consectetur Lorem cupidatat proident id sunt duis. Voluptate laboris commodo Lorem dolor nisi dolore esse.');";

const SQL_SELECT = 'SELECT * FROM test';

async function measureExecutionTime(callback: () => void) {
  const startTime = Date.now();
  await callback();
  const endTime = Date.now();
  return endTime - startTime;
}

export async function runTest2() {
  const r: any = {};
  r.c2 = await measureExecutionTime(async () => await db.execute(SQL_CREATE));
  r.t2 = await measureExecutionTime(async () => {
    for (let i = 0; i < C_INSERT; i++) {
      await db.transaction(async tx => {
        await tx.executeAsync(SQL_INSERT);
      });
    }
  });
  r.s2 = await measureExecutionTime(async () => {
    for (let i = 0; i < C_SELECT; i++) {
      await db.execute(SQL_SELECT + ' WHERE ID >= ?', [i]);
    }
  });
  r.d2 = await measureExecutionTime(async () => await db.execute(SQL_DROP));

  console.info(r);
  return `INSERT: ${r.t2}, SELECT: ${r.s2}`;
}
