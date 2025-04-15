$w.onReady(function () {
    const charterLinks = Array.from({ length: 28 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            label: `Article ${num}`,
            link: `/charter/article-${num}`
        };
    });

    $w("#charterNavigatorRepeater").data = charterLinks;

    $w("#charterNavigatorRepeater").onItemReady(($item, itemData) => {
        $item("#charterLink").label = itemData.label;
        $item("#charterLink").link = itemData.link;
    });
});