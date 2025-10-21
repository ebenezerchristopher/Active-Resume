import { Module } from "@nestjs/common";
import { ResumeService } from "./resume.service";
import { ResumeResolver } from "./resume.resolver";
import { PrinterModule } from "../printer/printer.module";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [PrinterModule, StorageModule],
  providers: [ResumeResolver, ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
