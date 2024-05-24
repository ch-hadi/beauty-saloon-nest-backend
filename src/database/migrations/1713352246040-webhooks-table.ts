import { MigrationInterface, QueryRunner } from "typeorm";

export class WebhooksTable1713352246040 implements MigrationInterface {
    name = 'WebhooksTable1713352246040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stripe_events" ("id" character varying NOT NULL, "customer_id" character varying, CONSTRAINT "PK_d3247bd5fc3f66b6982bbcdd897" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "state_code"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "state_name"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "country_id"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "country_code"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "country_name"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "wikidataid"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "country_code"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "country_name"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "state_code"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "iso2"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "numeric_code"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "capital"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "currency_name"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "currency_symbol"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "tld"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "native"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "subregion"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "timezones"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "emoji"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "emojiu"`);
        await queryRunner.query(`ALTER TABLE "userSubscription" ADD "subscription_id" character varying DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "cities_id_seq" OWNED BY "cities"."id"`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "id" SET DEFAULT nextval('"cities_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "states" ALTER COLUMN "id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "states_id_seq" OWNED BY "states"."id"`);
        await queryRunner.query(`ALTER TABLE "states" ALTER COLUMN "id" SET DEFAULT nextval('"states_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "states" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "countries" ADD CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "countries_id_seq" OWNED BY "countries"."id"`);
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "id" SET DEFAULT nextval('"countries_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "iso3"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "iso3" character varying`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "phone_code"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "phone_code" character varying`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_1229b56aa12cae674b824fccd13" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_1229b56aa12cae674b824fccd13"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "phone_code"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "phone_code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "iso3"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "iso3" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "countries_id_seq"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18"`);
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "states" ADD "name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "states" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "states_id_seq"`);
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "PK_09ab30ca0975c02656483265f4f"`);
        await queryRunner.query(`ALTER TABLE "states" ALTER COLUMN "id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "name" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "cities_id_seq"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e"`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userSubscription" DROP COLUMN "subscription_id"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "emojiu" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "emoji" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "longitude" real`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "latitude" real`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "timezones" character varying(4096)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "subregion" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "region" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "native" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "tld" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "currency_symbol" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "currency_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "currency" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "capital" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "numeric_code" integer`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "iso2" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "states" ADD "longitude" real`);
        await queryRunner.query(`ALTER TABLE "states" ADD "latitude" real`);
        await queryRunner.query(`ALTER TABLE "states" ADD "type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "states" ADD "state_code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "states" ADD "country_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "states" ADD "country_code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "wikidataid" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "longitude" real`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "latitude" real`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "country_name" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "country_code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "country_id" integer`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "state_name" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "state_code" character varying(50)`);
        await queryRunner.query(`DROP TABLE "stripe_events"`);
    }

}