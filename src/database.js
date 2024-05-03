import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
        data = data.filter(row => {
            return Object.entries(search).some(([key, value]) => {

                if (row && row[key] !== undefined && row[key] !== null) {
                    if (typeof row[key] === 'string' && typeof value === 'string') {
                        return row[key].toLowerCase().includes(value.toLowerCase());
                    }
                }
                return false;
            });
        });
    }

    return data;
}

  insert(table, data) {
    if (Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    if (this.#database[table]) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data };
            
            if (typeof this.#persist === 'function') {
                this.#persist();
            }
        } else {
            console.error('Undefinied');
        }
    } else {
        console.error('Undefinied');
    }
}


  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist
    }
  }
}