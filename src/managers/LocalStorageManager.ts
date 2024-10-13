export class LocalStorageManager<LocalStorageType> {
    key: string;
    defaultValue: unknown;

    constructor(key: string, defaultValue: unknown) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    get raw() {
        return (
            localStorage.getItem(this.key) || JSON.stringify(this.defaultValue)
        );
    }

    get parsed() {
        return JSON.parse(this.raw) as LocalStorageType;
    }

    update(evaluator: (ls: LocalStorageType) => LocalStorageType) {
        const ls = this.parsed;
        const newLs = evaluator(ls);
        localStorage.setItem(this.key, JSON.stringify(newLs));

        return newLs;
    }
}
