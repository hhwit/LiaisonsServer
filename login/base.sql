DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(255) NOT NULL DEFAULT '''''',
  `password` varchar(255) NOT NULL DEFAULT '''''',
  `created_time` int(11) NOT NULL DEFAULT '0',
  `last_login_ip` varchar(60) NOT NULL DEFAULT '''''',
  `last_login_time` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

