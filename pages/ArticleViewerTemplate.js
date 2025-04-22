import { getRAISAlertsForArticle } from 'backend/rais-alert-manager';

$w.onReady(async function () {
    const articleNum = $w("#articleTitle").text.split(" ")[1]; // Get Article I–XXVIII
    const alerts = await getRAISAlertsForArticle(articleNum);

    if (alerts && alerts.length > 0) {
        $w("#raisAlertBox").expand();
        $w("#raisAlertRepeater").data = alerts;
        $w("#raisAlertRepeater").onItemReady(($item, itemData) => {
            $item("#alertText").text = itemData.message;
        });
    } else {
        $w("#raisAlertBox").collapse();
    }
});