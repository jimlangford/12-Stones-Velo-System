/// <reference path="..\masterPage\masterPage.d.ts" />
type PageElementsMap = MasterPageElementsMap & {
	"#blog1": $w.IFrame;
	"#section1": $w.Section;
	"#page1": $w.Page;
}