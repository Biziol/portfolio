# ************************************************************
# Antares - SQL Client
# Version 0.7.35
# 
# https://antares-sql.app/
# https://github.com/antares-sql/antares
# 
# Host: 127.0.0.1 (MariaDB Server 11.8.6)
# Database: portfolio_db
# Generation time: 2026-06-02T19:16:24+02:00
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table argument
# ------------------------------------------------------------

DROP TABLE IF EXISTS `argument`;

CREATE TABLE `argument` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `text` text DEFAULT NULL,
  `work_and_training_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKba780f41rvgmtwyk3pg1at5kx` (`work_and_training_id`),
  CONSTRAINT `FKba780f41rvgmtwyk3pg1at5kx` FOREIGN KEY (`work_and_training_id`) REFERENCES `work_and_training` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

LOCK TABLES `argument` WRITE;
/*!40000 ALTER TABLE `argument` DISABLE KEYS */;

INSERT INTO `argument` (`id`, `text`, `work_and_training_id`) VALUES
	(1, "Partecipazione a percorso intensivo di formazione e inserimento aziendale", 1),
	(2, "Sviluppo Full Stack: Progettazione e implementazione di Web App completa con Spring Boot e React", 1),
	(3, "Version Control: Gestione del ciclo di vita del software con Git", 1),
	(4, "Problem Solving: Applicazione pratica di OOP e gestione dello stato lato client", 1);

/*!40000 ALTER TABLE `argument` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table contact_information
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contact_information`;

CREATE TABLE `contact_information` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `field_name` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;





# Dump of table review
# ------------------------------------------------------------

DROP TABLE IF EXISTS `review`;

CREATE TABLE `review` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `author` varchar(255) NOT NULL,
  `comment` text DEFAULT NULL,
  `stars` int(11) DEFAULT NULL,
  `creation_date` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;





# Dump of table skill
# ------------------------------------------------------------

DROP TABLE IF EXISTS `skill`;

CREATE TABLE `skill` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `skill_field` enum('BACKEND','DATABASE','DEVOPS','FRONTEND','OTHER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;

INSERT INTO `skill` (`id`, `name`, `skill_field`) VALUES
	(1, "React", "FRONTEND"),
	(2, "Flutter", "FRONTEND"),
	(3, "HTML", "FRONTEND"),
	(4, "CSS", "FRONTEND"),
	(5, "JavaScript", "FRONTEND"),
	(6, "Java", "BACKEND"),
	(7, "Spring Boot", "BACKEND"),
	(8, "REST API", "BACKEND"),
	(9, "SQL", "DATABASE"),
	(10, "PostgreSQL", "DATABASE"),
	(11, "MySQL", "DATABASE"),
	(12, "Git", "DEVOPS"),
	(13, "Linux", "DEVOPS"),
	(14, "Vite", "DEVOPS"),
	(15, "Maven", "DEVOPS");

/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table task
# ------------------------------------------------------------

DROP TABLE IF EXISTS `task`;

CREATE TABLE `task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `state` enum('COMPLETED','IN_PROGRESS','TODO') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `creation_date` datetime(6) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpvm6p5e1kes0pgp0kgtton144` (`username`),
  CONSTRAINT `FKpvm6p5e1kes0pgp0kgtton144` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;





# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` tinyint(4) DEFAULT NULL CHECK (`role` between 0 and 1),
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;





# Dump of table work_and_training
# ------------------------------------------------------------

DROP TABLE IF EXISTS `work_and_training`;

CREATE TABLE `work_and_training` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `end_date` date DEFAULT NULL,
  `graduation` double DEFAULT NULL,
  `graduation_type` enum('EQF','HUNDRED_BASE','TEN_BASE') DEFAULT NULL,
  `institute_or_company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('TRAINING','WORK') DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

LOCK TABLES `work_and_training` WRITE;
/*!40000 ALTER TABLE `work_and_training` DISABLE KEYS */;

INSERT INTO `work_and_training` (`id`, `end_date`, `graduation`, `graduation_type`, `institute_or_company`, `location`, `start_date`, `title`, `type`, `website`) VALUES
	(1, "2026-04-24", NULL, NULL, "SMC Treviso srl", "Rome, Italy", "2025-12-25", "Tirocinante Full Stack", "WORK", "https://www.smc.it/homepage"),
	(2, "2024-09-23", 4, "EQF", "ITI - Di Vittorio Lattanzio", "Roma, Italia", "2019-09-08", "Diploma di Maturità", "TRAINING", "https://divittoriolattanzio.it/home/index.php"),
	(3, "2026-09-02", 5, "EQF", "ITS - Lazio Digital", "Roma, Italia", "2024-11-15", "Diploma Tecnico Superiore", "TRAINING", "https://www.laziodigital.it/");

/*!40000 ALTER TABLE `work_and_training` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of views
# ------------------------------------------------------------

# Creating temporary tables to overcome VIEW dependency errors


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# Dump completed on 2026-06-02T19:16:24+02:00
