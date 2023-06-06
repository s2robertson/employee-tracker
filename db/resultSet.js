class ResultSet {
    constructor(rows, fields) {
        this.rows = rows;
        this.fields = fields.map(colDef => ({
            name: colDef.name,
            maxLength: colDef.name?.length || 0
        }));
        // calculate maxLength for each field
        this.fields.forEach(field => {
            this.rows.forEach(row => {
                const length = row[field.name]?.toString().length;
                if (length > field.maxLength) {
                    field.maxLength = length;
                }
            })
        });
    }

    toString() {
        let result = '';
        // column headers first
        for (const field of this.fields) {
            result += field.name.padEnd(field.maxLength + 2);
        }
        result += '\n';
        // '---' dividers
        for (const field of this.fields) {
            result += '-'.repeat(field.maxLength) + '  ';
        }
        // rows
        for (const row of this.rows) {
            result += '\n';
            for (const field of this.fields) {
                const fieldStr = row[field.name] === null ? 'null' : row[field.name].toString();
                result += fieldStr.padEnd(field.maxLength + 2);
            }
        }
        return result;
    }
}

module.exports = ResultSet;