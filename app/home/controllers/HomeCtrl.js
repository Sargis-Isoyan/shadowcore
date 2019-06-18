"use strict";

angular.module('app.home').controller('HomeController', function ($scope, $rootScope, $window, $timeout, ServerURL, SettingService, VideoService, CharacterService, $state, UdidTypes) {
    $scope.screenWidth = $window.innerWidth;
    $scope.$rootScope = $rootScope;
    $scope.UdidTypes = UdidTypes;
    $scope.Math = window.Math;

    $scope.videos = [];
    VideoService.get().then(function (response) {
        $scope.videos = response.data;
        if ($scope.videos.length && $scope.videos.length < 3) {
            for (var i = $scope.videos.length; i < 3; i++) {
                var item = angular.copy(response.data[0]);
                item.id = "new_" + i;
                $scope.videos.push(item);
            }
        }
        angular.forEach($scope.videos, function (row) {buy-section-wrapper
            row.image = "./styles/img/temp/home/video_overlay1.jpg";
            row.code = $scope.youtube_parser(row.youtube_url);
        })
    })

    $scope.youtube_parser = function (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    };

    $scope.scrollPage = function (index) {
        let height = $rootScope.pageHeight || 3000;
        window.scrollTo({
            left: 0,
            top: index * height / 4,
            behavior: 'smooth'
        });
    };

    /*
    $scope.videos = [
        {
            id: 1,
            name: "FIRST PUBLIC GAMEPLAY IS ON EVERYTHING!",
            duration: "25:46",
            description: "Navigating the next frontier of multiplayer has never felt so real and connected, delivered online and in VR.",
            image: "./styles/img/temp/home/video_overlay1.jpg",
            code: "Q7HGmUBQOHM_"
        }, {
            id: 2,
            name: "VOLUPTATEM ACCUSANTIUM DOLOREMQUE.",
            duration: "17:46",
            description: "A \"Ghost in the Shell\"-inspired theme coupled with action gameplay, intuitive controls, challenging enemies, and industrial atmosphere.",
            image: "./styles/img/temp/home/video_overlay2.jpg",
            code: "du1IFCWaD5k_"
        }, {
            id: 3,
            name: "TOTAM REM APERIAM, EAQUE IPSA QUAE AB ILL.",
            duration: "47:46",
            description: "Team up and become the adrenaline-charged mercenaries of your own sci-fi adventure set in the industrial post-apocalyptic world of the future.",
            image: "./styles/img/temp/home/video_overlay3.jpg",
            code: "C5Qp1hlXLko_"
        }, {
            id: 4,
            name: "FIRST PUBLIC GAMEPLAY IS ON EVERYTHING!",
            duration: "25:46",
            description: "Navigating the next frontier of multiplayer has never felt so real and connected, delivered online and in VR.",
            image: "./styles/img/temp/home/video_overlay1.jpg",
            code: "Q7HGmUBQOHM_"
        }, {
            id: 5,
            name: "VOLUPTATEM ACCUSANTIUM DOLOREMQUE.",
            duration: "17:46",
            description: "A \"Ghost in the Shell\"-inspired theme coupled with action gameplay, intuitive controls, challenging enemies, and industrial atmosphere.",
            image: "./styles/img/temp/home/video_overlay2.jpg",
            code: "du1IFCWaD5k_"
        }, {
            id: 6,
            name: "TOTAM REM APERIAM, EAQUE IPSA QUAE AB ILL.",
            duration: "47:46",
            description: "Team up and become the adrenaline-charged mercenaries of your own sci-fi adventure set in the industrial post-apocalyptic world of the future.",
            image: "./styles/img/temp/home/video_overlay3.jpg",
            code: "C5Qp1hlXLko_"
        }
    ];
    */

    $scope.characters = [];
    CharacterService.get().then(function (response) {
        $scope.characters = response.data;
        angular.forEach($scope.characters, function (row) {
            row.specs = row.specs.split("\n");
        })
        if ($scope.characters.length) {
            $scope.currCharacter = $scope.characters[0];
        }
    })

    /*
    $scope.characters = [
        {
            category: "ASSAULT",
            image: "./styles/img/temp/home/character1.jpg",
            specs: [
                "Standard mercenary",
                "Armed with assault rifle and grenade launcher",
                "Efficient at medium-range assaults",
                "Medium teleport countdown"
            ],
            description: "Choose the assault character if your playing style is aggressive and dynamic. The standard soldier is equipped to move quickly through the game environment. You are armed with an assault rifle and a grenade launcher for maximum damage at medium range.  With a medium amount of armour and a medium teleport cooldown for immersive gameplay."
        }, {
            category: "CONSECTEUR",
            image: "./styles/img/temp/home/character2.jpg",
            specs: [
                "Slow-moving and heavily armoured",
                "Strong defence and strategy kills",
                "Equipped with shotgun and EMP cannon for close-range assault",
                "Slow teleport cooldown"
            ],
            description: "Join the ranks of the support team for one of the international conglomerates battling for control of Earth’s resources and territories. Your character is heavily armoured and adept at taking and holding territory. Utilize your augmented body and the cybernetic implants that give you enhanced abilities. Support characters are capable of massive damage at close range with their shotgun. They are also equipped with an EMP cannon that doesn’t do any damage at all, but can temporarily stun enemies, preventing them from teleporting or shooting back."
        }, {
            category: "RECON",
            image: "./styles/img/temp/home/character3.jpg",
            specs: [
                "Fast and mobile",
                "Minimal amount of body armour",
                "Short teleport countdown",
                "Efficient at short range assault"
            ],
            description: "Recon characters strike a balance between mobility and assault capabilities. More lightly armoured than other characters, they are fast and hard to hit. You benefit from a shorter teleport cooldown and high-damage railgun and a machine pistol.  Move quickly and efficiently between locations and launch surprise attacks on your unsuspecting enemies."
        }
    ];
    $scope.currCharacter = $scope.characters[0];
    */

    $scope.scrollDown = function () {
        $window.scrollTo(0, angular.element('.video-section').offset().top - 100);
    };

    $scope.shop = function (type) {
        $state.go("buynow", {type: type})
    };

    $scope.currSlideInd = 0;


    // $scope.setting = {};
    // SettingService.getSetting().then(function (res) {
    //     var data = res.data;
    //     $scope.setting = data;
    // })


    $timeout(function () {
        var maxHeight = 0;
        angular.element('.videos-wrapper h4').each(function () {
            if (maxHeight < angular.element(this).height()) {
                maxHeight = angular.element(this).height();
            }
        });
        angular.element('.videos-wrapper h4').css('height', maxHeight);
    }, 200);
});
