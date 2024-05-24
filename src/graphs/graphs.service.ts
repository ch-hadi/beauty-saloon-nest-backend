import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Graph } from './entities/graph.entity';
import { DataSource, Repository } from 'typeorm';
import { Users } from '@/users/entities/user.entity';
// import { AgreementTypes } from '@/common/constants/enum';

@Injectable()
export class GraphsService {
  constructor(
    @InjectRepository(Graph)
    private graphRepo: Repository<Graph>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}
  async create(body: CreateGraphDto) {
    const create_graphs = this.graphRepo.create(body);

    return await this.graphRepo.save(create_graphs);
  }

  async findAll() {
    const result = await this.graphRepo.find();
    return result;
  }

  async getRegisteredUsersCount() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const result = await this.userRepo.query(`
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (MONTH(NOW())-1) MONTH), '%Y-%m-01') AS month
        UNION ALL
        SELECT DATE_ADD(month, INTERVAL 1 MONTH)
        FROM months
        WHERE month < DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (MONTH(NOW())-1) MONTH), '%Y-%m-01') + INTERVAL 11 MONTH
      )
      SELECT
        DATE_FORMAT(month, '%b') as month,
        COUNT(u.id) as count
      FROM months m
      LEFT JOIN users u 
        ON MONTH(u.created_at) = MONTH(m.month)
        AND YEAR(u.created_at) = YEAR(m.month)
        AND u.deleted_at IS NULL
      GROUP BY m.month
      ORDER BY m.month;
    `);
      const totalUsers = await this.userRepo.count();
      const finalResponse = result?.map(
        (row: { month: string; count: number }) => ({
          month: row.month,
          count: row.count,
        }),
      );

      return { totalUsers, graphs: finalResponse };
    } catch (error: any) {
      await queryRunner.release();
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // async getQuestionsCounts() {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   try {
  //     const result = await this.userRepo.query(`
  //     SELECT 
  //     'batches-agreements' AS agreement_type,
  //     COUNT(CASE WHEN question_type = 'userDefinedQuestion' THEN question->>'questionText' END) AS total_userdefined_questions,
  //     COUNT(CASE WHEN question_type = 'preDefinedQuestionAnalysis' THEN question->>'questionText' END) AS total_predefined_questions,
  //     COALESCE(COUNT( CASE WHEN question_type = 'userDefinedQuestion' THEN question->>'questionText' END), 0) + COALESCE(COUNT(DISTINCT CASE WHEN question_type = 'preDefinedQuestionAnalysis' THEN question->>'questionText' END), 0) AS total_questions
  //     FROM 
  //         "batchAgreements",
  //         LATERAL (
  //           SELECT 'userDefinedQuestion' AS question_type, jsonb_array_elements("userDefinedQuestion") AS question
  //           UNION ALL
  //           SELECT 'preDefinedQuestionAnalysis' AS question_type, jsonb_array_elements("preDefinedQuestionAnalysis") AS question
  //         ) AS subquery
  //     GROUP BY 
  //     agreement_type;
  //     `);

  //     const singleAgreement = await this.userRepo.query(`
  //     SELECT 
  //     agreement_type,
  //     SUM(cnt) AS total_questions,
  //     SUM(CASE WHEN question_type = 'predefinedQuestion' THEN cnt ELSE 0 END) AS predefined_questions,
  //     SUM(CASE WHEN question_type = 'userDefinedQuestions' THEN cnt ELSE 0 END) AS user_defined_questions
  // FROM (
  //     SELECT 'predefinedQuestion' AS question_type, COUNT(*) AS cnt, 'single-agreements' AS agreement_type
  //     FROM "predefinedQuestion"
  //     UNION ALL
  //     SELECT 'userDefinedQuestions' AS question_type, COUNT(*) AS cnt, 'single-agreements' AS agreement_type
  //     FROM "userDefinedQuestions"
  // ) AS counts
  // GROUP BY agreement_type;
  // `);
  //     // const finalResponse = result?.map(
  //     //   (row: { month: string; count: number }) => ({
  //     //     month: row.month,
  //     //     count: row.count,
  //     //   }),
  //     // );

  //     return { singleAgreement, batchesAgreements: result };
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async getUserQuestionsCount(userId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   try {
  //     const result = await this.userRepo
  //       .query(`SELECT SUM("consumeUserDefinedQuestion") AS total_questions FROM "userSubscription" WHERE 
  //     "authorId" = '${userId}';`);

  //     return result;
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async getUsersQuestionsCount() {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   try {
  //     const result = await this.userRepo.query(
  //       `SELECT SUM("consumeUserDefinedQuestion") AS total_questions FROM "userSubscription";`,
  //     );

  //     return result;
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async getAllAgreementsCounts() {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();

  //   try {
  //     const [result] = await queryRunner.query(`SELECT
  //     SUM(agreements_count) AS total_agreements,
  //     SUM(batch_agreements_count) AS total_batch_agreements,
  //     SUM(total_count) AS total
  // FROM (
  //     SELECT
  //         COUNT(*) AS agreements_count,
  //         0 AS batch_agreements_count,
  //     COUNT(*) AS total_count
  //     FROM
  //         agreements
  //     UNION ALL
  //     SELECT
  //         0 AS agreements_count,
  //         COUNT(*) AS batch_agreements_count,
  //     COUNT(*) AS total_count
  //     FROM
  //         "batchAgreements"
     
  // ) AS counts;`);
  //     return result;
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async getAgreementsCounts(userId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();

  //   try {
  //     const [result] = await queryRunner.query(`SELECT
  //     SUM(agreements_count) AS total_agreements,
  //     SUM(batch_agreements_count) AS total_batch_agreements,
  //     SUM(total_count) AS total
  // FROM (
  //     SELECT
  //         COUNT(*) AS agreements_count,
  //         0 AS batch_agreements_count,
  //     COUNT(*) AS total_count
  //     FROM
  //         agreements
  //     WHERE
  //         "authorId" = '${userId}'
  //     UNION ALL
  //     SELECT
  //         0 AS agreements_count,
  //         COUNT(*) AS batch_agreements_count,
  //     COUNT(*) AS total_count
  //     FROM
  //         "batchAgreements"
  //     INNER JOIN
  //         batches ON batches.id = "batchAgreements"."batchId"
  //     WHERE
  //         batches."authorId" = '${userId}'
  // ) AS counts;`);
  //     return result;
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  // async getAgreementsCounts(userId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();

  //   try {
  //     const result: {
  //       totalAgreements?: number;
  //       totalBatchAgreements?: number;
  //       total?: number;
  //     } = {};

  //     const agreementsCount = await queryRunner.query(
  //       `SELECT COUNT(*) AS total_agreements FROM agreements WHERE "authorId" = $1`,
  //       [userId],
  //     );
  //     const batchAgreementsCount = await queryRunner.query(
  //       `SELECT COUNT(*) AS total_batch_agreements FROM "batchAgreements" INNER JOIN batches ON batches.id = "batchAgreements"."batchId" WHERE batches."authorId" = $1`,
  //       [userId],
  //     );

  //     result.totalAgreements =
  //       Number(agreementsCount[0].total_agreements) ||
  //       agreementsCount[0].total_agreements;
  //     result.totalBatchAgreements =
  //       Number(batchAgreementsCount[0].total_batch_agreements) ||
  //       batchAgreementsCount[0].total_batch_agreements;
  //     result.total =
  //       Number(result.totalAgreements) + Number(result.totalBatchAgreements) ||
  //       0;

  //     return result;
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async getAgreementsCount() {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();

  //   try {
  //     const result = await queryRunner.query(`
  //     WITH months AS (
  //           SELECT generate_series(
  //             date_trunc('year', NOW()),
  //             date_trunc('year', NOW()) + interval '11 months',
  //             interval '1 month'
  //           )::DATE as month
  //         )
  //         SELECT
  //           EXTRACT(MONTH FROM m.month) as month,
  //           a."agreementType" as agreement_type,
  //           COUNT(a.id) as count
  //         FROM months m
  //         LEFT JOIN agreements a ON EXTRACT(MONTH FROM a."created_at") = EXTRACT(MONTH FROM m.month)
  //         WHERE a."agreementType" IS NOT NULL
  //         GROUP BY m.month, a."agreementType"
  //         ORDER BY m.month, a."agreementType"
  //     `);

  //     const agreementTypeNames = Object.values(AgreementTypes);

  //     const formattedData = agreementTypeNames.map((agreementType) => {
  //       const data = Array(12).fill(0);
  //       result?.forEach(
  //         (row: {
  //           month: string;
  //           count: string;
  //           agreement_type: AgreementTypes;
  //         }) => {
  //           const monthIndex = parseInt(row.month, 10) - 1;
  //           const count = parseInt(row.count, 10);
  //           if (row.agreement_type === agreementType) {
  //             data[monthIndex] = count;
  //           }
  //         },
  //       );
  //       return {
  //         name: agreementType,
  //         data,
  //       };
  //     });

  //     return {
  //       graphs: formattedData,
  //     };
  //   } catch (error: any) {
  //     await queryRunner.release();
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async questionsGraphs() {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   try {
  //     const result = await this.userRepo.query(`
  //     WITH months AS (
  //       SELECT generate_series(
  //             date_trunc('year', NOW()),
  //             date_trunc('year', NOW()) + interval '11 months',
  //             interval '1 month'
  //           )::DATE as month
  //     )
  //     SELECT
  //       to_char(m.month, 'MON') AS month,
  //       COUNT(b.created_at) AS count,
  //       COALESCE(SUM(jsonb_array_length(b."userDefinedQuestion")), 0)
  //       AS total_user_define_question,
  //       COALESCE(SUM(jsonb_array_length(b."preDefinedQuestionAnalysis")), 0)
  //       AS total_pre_defined_questions,
  //       COALESCE(SUM(jsonb_array_length(b."userDefinedQuestion")), 0)
  //       + COALESCE(SUM(jsonb_array_length(b."preDefinedQuestionAnalysis")), 0) as total_questions
  //     FROM months m
  //     LEFT JOIN "batchAgreements" b ON 
  //     date_trunc('month', b.created_at) = m.month
  //     GROUP BY m.month
  //     ORDER BY m.month;
      
  //   `);

  //     return result;
  //   } catch (error: any) {
  //     throw new HttpException(
  //       error?.response?.body?.errors[0]?.message || error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
