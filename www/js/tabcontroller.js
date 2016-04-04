/**
 * Created by Gebruiker on 1-4-2016.
 */
function TabController(catchcontroller) {
    this.catchcontroller = catchcontroller;
}

TabController.prototype = {
    init: function () {
        this.addListeners();
    },
    addListeners: function () {
        var self = this;
        $("div[data-role=content]").on("swipeleft swiperight", function(event) { self.onSwipe(event )});
        $(document).on("swipeleft swiperight", function (event) {
            self.onSwipe(event)
        });

        $('[data-role="navbar"] a').click(function() {self.onTabChanged(this); });
    },
    onSwipe: function (event) {
        this.changeNavTab(event.type == 'swipeleft');
    },
    changeNavTab: function (left) {
        var $tabs = $("div[data-role=navbar] li a", $("div[data-role=page].ui-page-active"));
        var curidx = $tabs.closest("a.ui-state-persist").parent().index();
        var nextidx = 0;
        if (left) {
            if(curidx == $tabs.length - 1) return;
            nextidx = curidx + 1;
        } else {
            if(curidx == 0) return;
            nextidx = curidx - 1;
        }
        $tabs.eq(nextidx).click();
    },
    onTabChanged: function(element) {
        var tab = $(element).attr('href');
        $('div[data-role=navbar] li a').removeClass('ui-state-persist');
        $(element).addClass('ui-state-persist');
        if(tab == '#tab2') {
            this.catchcontroller.init();
        }
    }
};