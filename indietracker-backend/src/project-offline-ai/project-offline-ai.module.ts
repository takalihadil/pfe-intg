import { Module } from '@nestjs/common';
import { ProjectOfflineAiService } from './project-offline-ai.service';
import { ProjectOfflineAiController } from './project-offline-ai.controller';
import { SaleService } from 'src/sale/sale.service';
import { ExpensesService } from 'src/expenses/expenses.service';
import { TimeEntryService } from 'src/time-entry/time-entry.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserlocationService } from 'src/userlocation/userlocation.service';
import { BusinessPlanService } from 'src/business-plan/business-plan.service';
import { SaleModule } from 'src/sale/sale.module';
import { SaleDigitalService } from 'src/sale-digital/sale-digital.service';
import { SaleDigitalModule } from 'src/sale-digital/sale-digital.module';
import { ProfitModule } from 'src/profit/profit.module';

@Module({
  providers: [ProjectOfflineAiService,ExpensesService,TimeEntryService,UserlocationService,BusinessPlanService],
  controllers: [ProjectOfflineAiController],
  imports: [AuthModule, PrismaModule, SaleModule,SaleDigitalModule,ProfitModule],
})
export class ProjectOfflineAiModule {}
