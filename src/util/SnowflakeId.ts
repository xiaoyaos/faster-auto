//生成雪花id
import FlakeId from "flake-idgen";
const int_format = require('biguint-format');

export class SnowflakeId {
    private static flake_id: FlakeId;

    static init(id: number) {
        SnowflakeId.flake_id = new FlakeId({id: id})
    }

    static id(): string {
        return int_format(SnowflakeId.flake_id.next(), 'hex').padStart(16, '0');
    }
}
