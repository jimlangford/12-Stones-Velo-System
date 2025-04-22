import { checkSECCompliance } from 'backend/sec-compliance-engine';

$w.onReady(async function () {
    const auditResults = await checkSECCompliance();
    $w("#secComplianceRepeater").data = auditResults;

    $w("#secComplianceRepeater").onItemReady(($item, itemData) => {
        $item("#scrollId").text = itemData.scrollId;
        $item("#complianceStatus").text = itemData.status;
        $item("#issues").text = itemData.issues;
    });
});