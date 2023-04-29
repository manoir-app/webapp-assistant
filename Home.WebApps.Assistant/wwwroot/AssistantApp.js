///<reference path="typings/angular.d.ts" />
///<reference path="typings/manoirApp.d.ts" />
///<reference path="typings/angular-sanitize.d.ts" />
///<reference path="typings/angular-animate.d.ts" />
///<reference path="typings/signalr/index.d.ts" />
///<reference path="typings/manoirApp.d.ts" />
var Manoir;
(function (Manoir) {
    var AssistantApp;
    (function (AssistantApp) {
        class DefaultPage extends Manoir.Common.ManoirAppPage {
            constructor($scope, $http, $timeout) {
                super();
                this.scope = $scope;
                this.http = $http;
                this.$timeout = $timeout;
                this.scope.Events = this;
                this.scope.Loading = true;
                this.scope.isAdding = false;
                let self = this;
                this.init();
                this.RefreshData();
                setInterval(function () { self.RefreshData(); }, 5000);
            }
            init() {
                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl("/hubs/1.0/appanddevices")
                    .withAutomaticReconnect()
                    .build();
                this.connection.on("notifyMeshChange", this.onMeshChange);
                this.connection.start().catch(err => console.error(err));
                try {
                    super.checkLogin(true);
                }
                catch (e) {
                    document.location.reload(true);
                }
            }
            onMeshChange(changeType, mesh) {
                console.log(mesh);
            }
            RefreshData() {
                let self = this;
                let sc = self.scope;
                let url = "api/presence?ts=" + (new Date).getTime();
                fetch(url)
                    .then(res => res.json())
                    .then(json => {
                    sc.currentPresence = json;
                    sc.Loading = false;
                    sc.$applyAsync(function () { });
                });
            }
        }
        AssistantApp.DefaultPage = DefaultPage;
    })(AssistantApp = Manoir.AssistantApp || (Manoir.AssistantApp = {}));
})(Manoir || (Manoir = {}));
var theApp = angular.module('AssistantApp', []);
theApp.controller('DefaultPage', Manoir.AssistantApp.DefaultPage);
theApp.filter('trustAsHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});
//# sourceMappingURL=AssistantApp.js.map