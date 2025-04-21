/// <reference path="..\masterPage\masterPage.d.ts" />
type PageElementsMap = MasterPageElementsMap & {
	"#sideCartLightboxController1": $w.AppController;
	"#lightbox1": $w.HiddenCollapsedElement;
	"#sideCart1": $w.IFrame;
	"#page1": $w.Page;
}