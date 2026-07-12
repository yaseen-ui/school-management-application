import { ImportWizard } from "@/components/imports/import-wizard";
import { ReadinessCheck } from "@/components/imports/readiness-check";

export default function ImportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Import Data</h2>
          <p className="text-muted-foreground">
            Bulk import students from Excel or CSV files into a section.
          </p>
        </div>
      </div>
      <ReadinessCheck>
        <ImportWizard />
      </ReadinessCheck>
    </div>
  );
}
