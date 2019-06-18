"use strict";


angular.module('app.admin', ['ui.router']).config(function ($stateProvider) {

    $stateProvider

        .state('app.admin', {
            url: '/admin',
            data: {
                title: 'Admin'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/news.html',
                    controller: 'NewsController'
                }
            }
        })
        .state('app.admin.news', {
            url: '/news',
            data: {
                title: 'News Management'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/news.html',
                    controller: 'NewsController'
                }
            }
        })
        .state('app.admin.subscribers', {
            url: '/subscribers',
            data: {
                title: 'Subscribe User'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/subscribers.html',
                    controller: 'SubscribersController'
                }
            }
        })
        .state('app.admin.buyers', {
            url: '/buyers',
            data: {
                title: 'Buyers'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/buyers.html',
                    controller: 'BuyersController'
                }
            }
        })
        .state('app.admin.users', {
            url: '/users',
            data: {
                title: 'User Management'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/users.html',
                    controller: 'UsersController'
                }
            }
        })
        .state('app.admin.contactUs', {
            url: '/contact-us',
            data: {
                title: 'Contact Us'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/contact-us.html',
                    controller: 'ContactUsController'
                }
            }
        })
        .state('app.admin.mailbox', {
            url: '/mailbox',
            data: {
                title: 'Mail Manage'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/mailbox.html',
                    controller: 'MailboxController'
                }
            }
        })
        .state('app.admin.udids', {
            url: '/udid',
            data: {
                title: 'UDID'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/udids.html',
                    controller: 'UdidsController'
                }
            }
        })
        .state('app.admin.joinTeamContents', {
            url: '/join-team-contents',
            data: {
                title: 'JoinTeam Images'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/join-team-contents.html',
                    controller: 'JoinTeamContentsController'
                }
            }
        })
        .state('app.admin.characterContents', {
            url: '/character-contents',
            data: {
                title: 'Characters'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/character-contents.html',
                    controller: 'CharacterContentsController'
                }
            }
        })
        .state('app.admin.videoContents', {
            url: '/video-contents',
            data: {
                title: 'Videos'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/video-contents.html',
                    controller: 'VideoContentsController'
                }
            }
        })
        .state('app.admin.aboutmeContents', {
            url: '/aboutme-contents',
            data: {
                title: 'About Me'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/aboutme-contents.html',
                    controller: 'AboutMeContentsController'
                }
            }
        })
        .state('app.admin.links', {
            url: '/external-links',
            data: {
                title: 'Videos'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/external-links.html',
                    controller: 'ExternalLinksController'
                }
            }
        })
        .state('app.admin.admin-users', {
            url: '/admin-users',
            data: {
                title: 'Admin Users'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/admin-users.html',
                    controller: 'AdminUsersController'
                }
            }
        })
        .state('app.admin.dailyreport', {
            url: '/sale-daily-report',
            data: {
                title: 'Sale Report'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/sale-report-daily.html',
                    controller: 'SaleReportTable1Controller'
                }
            }
        })
        .state('app.admin.monthlyreport', {
            url: '/sale-monthly-report',
            data: {
                title: 'Sale Report'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/sale-report-monthly.html',
                    controller: 'SaleReportTable2Controller'
                }
            }
        })
        .state('app.admin.grossrevenue', {
            url: '/gross-revenue',
            data: {
                title: 'Gross Revenue'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/gross-revenue.html',
                    controller: 'GrossRevenueController'
                }
            }
        })
        .state('app.admin.income', {
            url: '/income',
            data: {
                title: 'Income'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/income.html',
                    controller: 'InComeController'
                }
            }
        })
        .state('app.admin.settings', {
            url: '/settings',
            data: {
                title: 'Site Setting'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/admin/views/settings.html',
                    controller: 'SettingsController'
                }
            }
        })
});
