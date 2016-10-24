
export interface IVideo extends ng.IScope {
}

class Video {

    videoViewer: any;

    subscriber: any;

    player: any;

    playerWidth: string = '469px';
    playerHeight: string = '264px';
    top: string = '115px';
    right: string = '64px';
    zindex: string = '0';

    ip: string = '192.168.0.115';

    port: string = '1935';

    streamName: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(public bindings: IVideo,
                public stateService: angular.ui.IStateService) {

        if (stateService.params['ip']) {
            this.ip = stateService.params['ip'];
        }
        if (stateService.params['port']) {
            this.port = stateService.params['port'];
        }
        if (stateService.params['name']) {
            this.streamName = stateService.params['name'];
        }

    }

    $onInit(): void {
        try {
            
            /* !web-start */
            // Create a view instance based on video element id.
            this.videoViewer = new red5prosdk.PlaybackView('red5pro-video');

            // Create a new instance of the Flash/RTMP subcriber.
            this.subscriber = new red5prosdk.RTMPSubscriber();
            // Attach the subscriber to the view.
            this.videoViewer.attachSubscriber(this.subscriber);

            // Initialize
            this.subscriber.init({
                protocol: 'rtmp',
                host: this.ip,
                port: this.port,
                app: 'live',
                streamName: this.streamName.replace(' ', '-'),
                mimeType: 'rtmp/flv',
                swf: 'node_modules/red5pro-video-js.swf',
                useVideoJS: true,
                //swfobjectURL: 'node_modules/swfobject.js',
                // width: '100%',
                // height: '100%'
            })
            .then((player: any) => {
                // `player` is the WebRTC Player instance.
                // Invoke the play action.
                player.play();
                //this.player = player;
            })
            .catch((error: any) => {
                // A fault occurred while trying to initialize and playback the stream.
                console.error(error);
            });
            /* !web-stop */

        } catch (error) {
            console.log(error);
        }
    }

    $onDestroy(): void {

    }
}

export default angular.module('DroneSense.Web.Video', [

]).component('dsVideo', {
    bindings: {
    },
    controller: Video,
    templateUrl: './app/components/video/video.html'
});
