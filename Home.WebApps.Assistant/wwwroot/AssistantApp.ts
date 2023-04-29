///<reference path="typings/angular.d.ts" />
///<reference path="typings/manoirApp.d.ts" />
///<reference path="typings/angular-sanitize.d.ts" />
///<reference path="typings/angular-animate.d.ts" />
///<reference path="typings/signalr/index.d.ts" />
///<reference path="typings/manoirApp.d.ts" />

module Manoir.AssistantApp {

    interface IDefaultPageScope extends ng.IScope {
        Loading: boolean;
        currentPresence: Presence;
    }

    interface Presence {
        privacyModeActivated: boolean;
    }

    export class DefaultPage extends Manoir.Common.ManoirAppPage {
        connection: signalR.HubConnection;

        scope: IDefaultPageScope;
        $timeout: ng.ITimeoutService;
        http: any;
        constructor($scope: IDefaultPageScope, $http: any, $timeout: ng.ITimeoutService) {
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

        private init() {
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
                (document.location as any).reload(true);
            }
        }

        private onMeshChange(changeType: string, mesh: any): void {
            console.log(mesh);
        }



        public RefreshData(): void {
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
}

var theApp = angular.module('AssistantApp', []);

theApp.controller('DefaultPage', Manoir.AssistantApp.DefaultPage);
theApp.filter('trustAsHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    }
});

