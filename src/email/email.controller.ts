import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailDto, EmailOperationDto } from './dto/email.dto';

@ApiTags('Mail')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  send(@Body() body: EmailDto) {
    //  KEEP THE FROM EMAIL AND TEMPLATE_ID INTO THE ENV FILE PLS
    return this.emailService.sendMail(body);
  }

  @Post('/operation-confirmation')
  sendBatchConfirmationMail(@Body() body: EmailOperationDto) {
    return this.emailService.sendBatchMail(body);
  }
}
