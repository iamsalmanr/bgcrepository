/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: bgc_db
-- ------------------------------------------------------
-- Server version	10.11.15-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_forms`
--

DROP TABLE IF EXISTS `club_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_forms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_forms`
--

LOCK TABLES `club_forms` WRITE;
/*!40000 ALTER TABLE `club_forms` DISABLE KEYS */;
INSERT INTO `club_forms` VALUES
(1,'Permanent Membership Application Form','forms/1782537738_AbsentyMemberFrom.docx',1,1,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(2,'Guest Player & Daily Green Fee Entry Form','forms/1782537738_AbsentyMemberFrom.docx',2,1,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(3,'Tournament Entry & Handicap Declaration Form','forms/1782537738_AbsentyMemberFrom.docx',3,1,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(4,'Caddy & Golf Bag Locker Storage Allotment Form','forms/1782537738_AbsentyMemberFrom.docx',4,1,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(5,'Golf Cart Rental & Course Usage Agreement','forms/1782537738_AbsentyMemberFrom.docx',5,1,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(6,'Absentee Member Status Application','forms/1782537738_AbsentyMemberFrom.docx',6,1,'2026-08-27 13:09:05','2026-08-27 13:09:05');
/*!40000 ALTER TABLE `club_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committee_members`
--

DROP TABLE IF EXISTS `committee_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `committee_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `committee` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `committee_members_user_id_foreign` (`user_id`),
  CONSTRAINT `committee_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committee_members`
--

LOCK TABLES `committee_members` WRITE;
/*!40000 ALTER TABLE `committee_members` DISABLE KEYS */;
INSERT INTO `committee_members` VALUES
(1,'Major General Towhidul Ahmed, ndc, afwc, psc General officer commanding, 11 Infantry division.','Executive Committee','President',NULL,19,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(2,'Brigadier General Md Shohrab Hossain, BGOM, psc, (retired), Chief Executive Officer, Army Medical College, Bogura.','Executive Committee','Vice President',NULL,20,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(3,'Brigadier General S M Sazzad Hossain, BSP, SPP, PPM, afwc, psc, Comd 93 Armoured Brigade.','Executive Committee','Member',NULL,21,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(4,'Brigadier General Shahriar Jabed Chowdhury, hdmc, afwc, psc, G, Commander, 11 Artillery Brigade.','Executive Committee','Member',NULL,22,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(5,'Brigadier General Md Tanvir Hossan, psc Commander, 26 Infantry Brigade.','Executive Committee','Member',NULL,23,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(6,'Brigadier General Zahidur Rahman, afwc, psc, Commander, 111 Infantry Brigade.','Executive Committee','Member',NULL,24,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(7,'Brigadier General Md Habibur Rahman, SGP, PPM, afwc, psc, Commander, 30 Infantry Brigade.','Executive Committee','Member',NULL,25,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(8,'Brigadier General Md Ahsan Habib, SUP, ndc, psc Commandant, JCO NCO Academy.','Executive Committee','Member',NULL,26,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(9,'Brigadier General Hasnat Ahmed, SPP, psc, Commandant, Armoured Corps Center and School.','Executive Committee','Member',NULL,27,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(10,'Brigadier General Md Rezaul Karim, Station Commander, Station Headquarters, Bogura.','Executive Committee','Member',NULL,28,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(11,'Lieutenant Colonel Mohammad Sarwar Alam, psc, AA&QMG, Armoured Corps Center and School (Record Wing)','Executive Committee','Member',NULL,29,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(12,'Lieutenant Colonel Tanvir Ahmed, psc, Commander, Military Engineering Service.','Executive Committee','Member',NULL,30,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(13,'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal.','Executive Committee','Member',NULL,31,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(14,'CEO, Cantonment Board.','Executive Committee','Member',NULL,32,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(15,'Md Nazrul Islam Salim, Proprietor, Red Chilies','Executive Committee','Member',NULL,33,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(16,'Dr. Md Matiur Rahman, Deputy Executive Director, TMSS Medical College.','Executive Committee','Member',NULL,34,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(17,'Tarif Mohammad Apon, Owner, AT Fisheries.','Executive Committee','Member',NULL,35,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(18,'Brigadier General Md Rezaul Karim, Station Commander, Station Headquarters, Bogura.','Development Committee','Chairman',NULL,3,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(19,'Lieutenant Colonel Tanvir Ahmed, psc, Commander, Military Engineering Service.','Development Committee','Member',NULL,4,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(20,'Lieutenant Colonel Mohammad Saidur Rahman, CEME, 11 Infantry Division.','Development Committee','Member',NULL,5,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(21,'Lieutenant Colonel Md Mamunur Rashid Rassel, psc, Commanding Officer, 4 Engineer Battalion.','Development Committee','Member',NULL,6,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(22,'Major Md Lutful Hadi, Station Staff Officer, Station Headquarters, Bogura.','Development Committee','Member',NULL,7,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(23,'Major Sabbir Adnan, GE (Army), Bogura.','Development Committee','Member',NULL,8,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(24,'Md Waliur Rahman, PD SASEC.','Development Committee','Member',NULL,9,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(25,'Dr. Md Khursid Alam, Civil Surgeon.','Development Committee','Member',NULL,10,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(26,'Brigadier General S M Sazzad Hossain, BSP, SPP, PPM, afwc, psc, Commander 93 Armoured Brigade.','Tournament Committee','Chairman',NULL,42,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(27,'Lieutenant Colonel Mohammad Sarwar Alam, psc, AA&QMG, Armoured Corps Center and School (Record Wing).','Tournament Committee','Member',NULL,43,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(28,'Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.','Tournament Committee','Member',NULL,44,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(29,'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal.','Tournament Committee','Member',NULL,45,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(30,'Dr. Md Matiur Rahman, Deputy Executive Director, TMSS Medical College.','Tournament Committee','Member',NULL,46,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(31,'Tarif Mohammad Apon, Owner, AT Fisheries.','Tournament Committee','Member',NULL,47,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(32,'Brigadier General Md Tanvir Hossan, psc, Commander, 26 Infantry Brigade.','Entertainment & Cultural Committee','Chairman',NULL,15,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(33,'Lieutenant Colonel Shahreen Tabassum Disha, psc, Commanding Officer, 4 Signal Battalion.','Entertainment & Cultural Committee','Member',NULL,16,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(34,'Lieutenant Colonel Abdullah Al Mamun, psc, Armoured Corps Center and School.','Entertainment & Cultural Committee','Member',NULL,17,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(35,'Lt Col Walid Mohammad Saifullah, PBGM, psc, G, JCO NCO Academy.','Entertainment & Cultural Committee','Member',NULL,18,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(36,'Brigadier General Md Habibur Rahman, SGP, PPM, afwc, psc, 30 Infantry Brigade.','Audit & Finance Committee','Chairman',NULL,0,NULL,'2026-06-27 04:15:27','2026-08-27 15:14:20'),
(37,'Colonel Abu Reza Mohammad Nasiruddin Ekram, BGBM, psc, Colonel Admin, Area Headquarters Bogura.','Audit & Finance Committee','Member',NULL,1,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(38,'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal and later on, Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.','Audit & Finance Committee','Member',NULL,2,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(39,'Brigadier General Md Ahsan Habib, SUP, ndc, psc, Commandant, JCO NCO Academy.','Discipline Committee','Chairman',NULL,11,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(40,'Colonel Mohammad Manirul Hossain, psc, G, Colonel GS, Directorate General of Forces Intelligence, Bogura.','Discipline Committee','Member',NULL,12,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(41,'Lieutenant Colonel Md Arif Rahman, psc, G+ Commanding Officer, Army Security Unit, Bogura.','Discipline Committee','Member',NULL,13,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(42,'Major Tanzim Hasan Rahat, Officer Commanding, 11 Field Intelligence Unit.','Discipline Committee','Member',NULL,14,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(43,'Colonel Abu Reza Mohammad Nasiruddin Ekram, BGBM, psc, Colonel Admin, Area Headquarters, Bogura.','Executive Committee','Treasurer',NULL,36,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(44,'Lieutenant Colonel Mohammad Sarwar Alam, psc AA&QMG, Armoured Corps Center and School (Record Wing).','Handicap Committee','Member',NULL,41,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(45,'Lieutenant Colonel Mohammad Sarwar Alam, psc AA&QMG, Armoured Corps Center and School (Record Wing).','Executive Committee','Golf Captain',NULL,37,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(46,'Mrs. Afrin Ahsan, spouse of Mr. Tariq Mohammad Apon.','Executive Committee','Lady Golf Captain',NULL,38,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(47,'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal and later on, Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.','Executive Committee','Member Secretary',NULL,39,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09'),
(48,'Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal (will take over as Member Secretary subsequently)','Executive Committee','Assistant Member Secretary',NULL,40,NULL,'2026-06-27 04:15:27','2026-08-27 15:12:09');
/*!40000 ALTER TABLE `committee_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_directories`
--

DROP TABLE IF EXISTS `contact_directories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_directories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `column` varchar(255) NOT NULL DEFAULT 'left',
  `title` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_directories`
--

LOCK TABLES `contact_directories` WRITE;
/*!40000 ALTER TABLE `contact_directories` DISABLE KEYS */;
INSERT INTO `contact_directories` VALUES
(1,'left','Email','bogragolf@gmail.com',1,'2026-06-27 03:35:55','2026-06-27 07:49:42'),
(2,'left','Restaurant','Contact No: 0173 000 4680, 0173 000 4690',2,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(3,'left','House Keeping','Contact No: 0173 000 4672',3,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(4,'left','Sports Section','Contact No: 0173 000 4616',4,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(5,'left','Registration Desk','Contact No: 0173 000 4608',5,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(6,'left','Billing Clerk','Contact No: 0173 000 4610',6,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(7,'left','Membership Clerk','Contact No: 0173 000 4613',7,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(8,'left','Pro Shop','Contact No: 01750 634 369',8,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(9,'left','Swimming Pool & Gym','Contact No: 0173 000 4684',9,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(10,'middle','Telephone Numbers','+88 02 9835105, 9835121, 9835123, 9835126, 9835127',1,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(11,'middle','Army Exchange Number','7790',2,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(12,'middle','Office Reception / Operator','0',3,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(13,'middle','Sports Section','224',4,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(14,'middle','Registration Desk','116',5,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(15,'middle','Billing Clerk','115',6,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(16,'middle','Membership Clerk','109',7,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(17,'middle','Restaurant','126',8,'2026-06-27 03:35:55','2026-06-27 07:48:31'),
(18,'middle','Swimming Pool','117',9,'2026-06-27 03:35:55','2026-06-27 07:48:31');
/*!40000 ALTER TABLE `contact_directories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_schedules`
--

DROP TABLE IF EXISTS `flight_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_schedules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_schedules`
--

LOCK TABLES `flight_schedules` WRITE;
/*!40000 ALTER TABLE `flight_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `flight_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_images`
--

DROP TABLE IF EXISTS `gallery_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_images`
--

LOCK TABLES `gallery_images` WRITE;
/*!40000 ALTER TABLE `gallery_images` DISABLE KEYS */;
INSERT INTO `gallery_images` VALUES
(9,'media/zHS9vNUVdtxBZUicWVMmygyL0SEdWDuDzRruZxSM.jpg','Picture19.jpg',NULL,0,1,'2026-08-27 15:22:41','2026-08-27 15:22:41'),
(10,'media/lDHzjn7Wr7h33gdgz1E6S8la0nY09yqUfIr5tdcL.jpg','Picture21.jpg',NULL,0,1,'2026-08-27 15:22:57','2026-08-27 15:22:57'),
(11,'media/U0U2exhd6c87HWDUIyqXvsXxaqITPR4zPWRxq6Rs.jpg','Picture1.jpg',NULL,0,1,'2026-08-27 15:22:59','2026-08-27 15:22:59'),
(12,'media/zs9GUuFS2Ij2RiaRbzaZd2timrCEBBlrDhp3u4hL.jpg','Picture2.jpg',NULL,0,1,'2026-08-27 15:23:00','2026-08-27 15:23:00');
/*!40000 ALTER TABLE `gallery_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_slides`
--

DROP TABLE IF EXISTS `hero_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero_slides` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `image_position` varchar(50) DEFAULT '50% 50%',
  `text_position` varchar(50) DEFAULT '50% 50%',
  `image_position_mobile` varchar(50) DEFAULT '50% 50%',
  `text_position_mobile` varchar(50) DEFAULT '50% 50%',
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_slides`
--

LOCK TABLES `hero_slides` WRITE;
/*!40000 ALTER TABLE `hero_slides` DISABLE KEYS */;
INSERT INTO `hero_slides` VALUES
(1,'hero_slides/wyCYeSUz0Xmpssgbqaf4PbNQ3EdDqICkQcxOYwqj.jpg','center center','50% 69%','center center','52% 75%','Welcome To Bogura Golf Club','Bogura Golf Club started its journey in 1990. It was inaugurated by the then President of the Club. Total area of the Club is stunning and located beautifully inside Bogura Cantonment.',0,1,'2026-06-17 20:01:28','2026-08-27 21:14:22');
/*!40000 ALTER TABLE `hero_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hole_in_ones`
--

DROP TABLE IF EXISTS `hole_in_ones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hole_in_ones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `hole_no` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hole_in_ones`
--

LOCK TABLES `hole_in_ones` WRITE;
/*!40000 ALTER TABLE `hole_in_ones` DISABLE KEYS */;
/*!40000 ALTER TABLE `hole_in_ones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_items`
--

DROP TABLE IF EXISTS `media_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `size` bigint(20) unsigned DEFAULT NULL,
  `type` enum('image','file') NOT NULL DEFAULT 'image',
  `folder` varchar(255) DEFAULT 'General',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `tournament_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_items_tournament_id_foreign` (`tournament_id`),
  CONSTRAINT `media_items_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_items`
--

LOCK TABLES `media_items` WRITE;
/*!40000 ALTER TABLE `media_items` DISABLE KEYS */;
INSERT INTO `media_items` VALUES
(1,'Picture1.jpg','media/U0U2exhd6c87HWDUIyqXvsXxaqITPR4zPWRxq6Rs.jpg','image/jpeg',526398,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(2,'Picture2.jpg','media/zs9GUuFS2Ij2RiaRbzaZd2timrCEBBlrDhp3u4hL.jpg','image/jpeg',208612,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(3,'Picture3.jpg','media/grFKpGtUp1MrD3ShswNcrXUIJE7PHr31tAQx1xrH.jpg','image/jpeg',187066,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(4,'Picture4.jpg','media/EVxVvlSwbSblXXytkhRlvUhj6ec2nVMApXIYUE7E.jpg','image/jpeg',229722,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(5,'Picture5.jpg','media/ZR7neV6qbo0lvQZjinaGRbDKHugkZHfhbB7jUXf5.jpg','image/jpeg',82895,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(6,'Picture6.png','media/2C5GNE8tDBmq5lrhobtmR2tUofMg6FJp9ZJ1itRi.png','image/png',535495,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(7,'Picture7.jpg','media/pgDzNBCdxM5D5vjFJnMVVqPGNN8RV90DBKa6pWwO.jpg','image/jpeg',54964,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(8,'Picture8.jpg','media/710X2jG6MaDS2ZgYlm3EjtstSyaqyquP82kW522l.jpg','image/jpeg',55323,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(9,'Picture9.png','media/veP9feeagaJQsFaNPqnRfVlZ3nfqxyFrOMe2wOAZ.png','image/png',631497,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(10,'Picture10.png','media/nfH3dQb8w80TvQxD6sLEaR9CWNvSRB0N1Bv6klQS.png','image/png',724662,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(11,'Picture11.png','media/sJXnoWOSzip2ZTsA7kxdw8CFsVNyFTAOb5jOGgye.png','image/png',856926,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(12,'Picture12.jpg','media/V3nOWOOz8wxmfdjaDVOxQfrOAfRbk1kDu9lOc655.jpg','image/jpeg',102299,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(13,'Picture13.png','media/nFLTPKEyjJhzrVUf3eRrmt2IFIlMS9JhvcTwph34.png','image/png',619363,'image','General','2026-06-17 20:31:03','2026-06-17 20:31:03',NULL),
(14,'Picture14.jpg','media/fNP5t0h1rrOMVMQsNZvip4RAuOdEv5uMCkDKGJ9A.jpg','image/jpeg',119389,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(15,'Picture15.jpg','media/jZUaBGIzOieUFs3xtSerlJfMpnE0A7gcBNqQFP08.jpg','image/jpeg',83900,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(16,'Picture16.jpg','media/153nVwLcLDWp0CqcgrCH1VladE07838uZ6wJG5CF.jpg','image/jpeg',63293,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(17,'Picture17.jpg','media/6vKChpM2HZ8FM6NHlihLPzqOTSzw18WfnEYSCUPK.jpg','image/jpeg',45532,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(18,'Picture18.jpg','media/XNhSukIbxuAUaja1ltMoB1CHY8iLsEKA2m0p3qZz.jpg','image/jpeg',121595,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(19,'Picture19.jpg','media/zHS9vNUVdtxBZUicWVMmygyL0SEdWDuDzRruZxSM.jpg','image/jpeg',789589,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(20,'Picture20.jpg','media/7C1Hh02uCvbKxetbT6oAxqRJ7HqaqOIaBSQrmC4M.jpg','image/jpeg',566995,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL),
(21,'Picture21.jpg','media/lDHzjn7Wr7h33gdgz1E6S8la0nY09yqUfIr5tdcL.jpg','image/jpeg',208612,'image','General','2026-06-17 20:31:12','2026-06-17 20:31:12',NULL);
/*!40000 ALTER TABLE `media_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `target` varchar(255) NOT NULL DEFAULT '_self',
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_items_menu_id_foreign` (`menu_id`),
  KEY `menu_items_parent_id_foreign` (`parent_id`),
  CONSTRAINT `menu_items_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `menu_items_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES
(3,2,NULL,'Home','/','_self',0,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(4,2,NULL,'About Us','#','_self',1,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(5,2,4,'Gallery','/photo-gallery','_self',0,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(6,2,4,'Executive Committee','/executive-committee','_self',1,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(8,2,4,'Tournament Committee','/tournament-committee','_self',3,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(9,2,4,'Development Committee','/development-committee','_self',4,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(10,2,4,'Audit & Finance Committee','/audit-finance-committee','_self',5,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(11,2,4,'Handicap Committee','/handicap-committee','_self',6,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(12,2,4,'Entertainment & Cultural Committee','/entertainment-cultural-committee','_self',7,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(15,2,NULL,'Notice Board','/notice-board','_self',2,'2026-06-17 19:39:01','2026-06-27 03:09:29'),
(16,2,NULL,'Membership','#','_self',3,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(17,2,16,'Procedure','/membership-applying-procedure','_self',0,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(18,2,16,'Fees','/fees','_self',1,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(19,2,16,'Club Form','/club-form','_self',2,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(20,2,NULL,'Tournament & Events','#','_self',4,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(21,2,20,'Live Tournament','/tournament','_self',0,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(22,2,20,'Upcoming Tournaments','/tournaments_schedule_plan','_self',1,'2026-06-17 19:39:01','2026-06-27 05:39:01'),
(23,2,NULL,'Membership Application','/golf/membership/application/menu','_self',5,'2026-06-17 19:39:01','2026-06-17 19:39:01'),
(24,2,NULL,'Contact us','/contact-us','_self',6,'2026-06-17 19:39:01','2026-06-27 03:11:23'),
(25,4,NULL,'Home','/','_self',0,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(26,4,NULL,'About Us','#','_self',1,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(27,4,26,'Gallery','/photo-gallery','_self',0,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(28,4,26,'Executive Committee','/executive-committee','_self',1,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(30,4,26,'Tournament Committee','/tournament-committee','_self',3,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(31,4,26,'Development Committee','/development-committee','_self',4,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(32,4,26,'Audit & Finance Committee','/audit-finance-committee','_self',5,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(33,4,26,'Handicap Committee','/handicap-committee','_self',6,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(34,4,26,'Entertainment & Cultural Committee','/entertainment-cultural-committee','_self',7,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(37,4,NULL,'Notice Board','/notice-board','_self',2,'2026-06-17 19:40:42','2026-06-27 03:09:29'),
(38,4,NULL,'Membership','#','_self',3,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(39,4,38,'Procedure','/membership-applying-procedure','_self',0,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(40,4,38,'Fees','/fees','_self',1,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(41,4,38,'Club Form','/club-form','_self',2,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(42,4,NULL,'Tournament & Events','#','_self',4,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(43,4,42,'Live Tournament','/tournament','_self',0,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(44,4,42,'Upcoming Tournaments','/tournaments_schedule_plan','_self',1,'2026-06-17 19:40:42','2026-06-27 05:39:01'),
(45,4,NULL,'Membership Application','/golf/membership/application/menu','_self',5,'2026-06-17 19:40:42','2026-06-17 19:40:42'),
(46,4,NULL,'Contact us','/contact-us','_self',6,'2026-06-17 19:40:42','2026-06-27 03:11:23'),
(47,2,20,'Tournament Results','/tournament-result','_self',2,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(48,2,20,'List of Winners','/list-of-winner','_self',3,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(49,2,20,'Hole in One Record','/hole-in-one-record','_self',4,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(50,2,20,'Flight Schedule','/flight-schedule','_self',5,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(51,4,42,'Tournament Results','/tournament-result','_self',2,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(52,4,42,'List of Winners','/list-of-winner','_self',3,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(53,4,42,'Hole in One Record','/hole-in-one-record','_self',4,'2026-06-27 05:39:01','2026-06-27 05:39:01'),
(54,4,42,'Flight Schedule','/flight-schedule','_self',5,'2026-06-27 05:39:01','2026-06-27 05:39:01');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL COMMENT 'top_bar, footer, mobile_hamburger',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `menus_location_unique` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES
(2,'Top Menu','top_bar','2026-06-17 19:39:01','2026-06-17 19:39:01'),
(4,'Mobile Menu','mobile_hamburger','2026-06-17 19:40:42','2026-06-17 19:40:42');
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_06_18_011019_create_settings_table',2),
(5,'2026_06_18_012801_create_menus_table',3),
(6,'2026_06_18_012908_create_menu_items_table',3),
(7,'2026_06_18_015425_create_hero_slides_table',4),
(8,'2026_06_18_021455_create_media_items_table',5),
(9,'2026_06_18_023408_create_gallery_images_table',6),
(10,'2026_06_27_023900_create_notices_table',7),
(11,'2026_06_27_024500_add_url_to_notices_table',8),
(13,'2026_06_27_043451_create_committee_members_table',9),
(14,'2026_06_27_045757_create_club_forms_table',10),
(15,'2026_06_27_050153_create_contact_directories_table',11),
(16,'2026_06_27_091638_create_pages_table',12),
(17,'2026_06_27_102515_create_tournaments_table',13),
(18,'2026_06_27_103517_add_role_to_users_table',14),
(19,'2026_06_27_104504_create_tournament_results_table',15),
(20,'2026_06_27_104523_create_hole_in_ones_table',15),
(21,'2026_06_27_104533_create_winner_lists_table',15),
(22,'2026_06_27_104552_create_flight_schedules_table',15),
(23,'2026_06_27_114322_create_partners_table',16),
(24,'2026_06_27_125633_add_profile_fields_to_users_table',17),
(25,'2026_06_27_131915_add_tournament_id_to_media_items_table',18),
(26,'2026_06_27_135450_create_quick_links_table',19),
(27,'2026_06_27_150542_add_image_position_to_hero_slides_table',20),
(28,'2026_06_27_152403_add_text_position_to_hero_slides_table',21),
(29,'2026_06_27_152801_add_mobile_positions_to_hero_slides_table',22),
(30,'2026_08_28_025500_add_member_id_to_users_table',23),
(31,'2026_08_28_031500_add_folder_to_media_items_table',24),
(32,'2026_08_28_032500_add_category_to_notices_table',25),
(33,'2026_08_28_033000_add_is_active_to_users_table',26),
(34,'2026_08_28_035746_create_scorecards_table',27),
(35,'2026_08_28_040650_create_tournament_registrations_table',28),
(36,'2026_08_28_044500_add_file_path_to_notices_table',29),
(37,'2026_08_28_060000_add_approval_fields_to_scorecards_table',30);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT 'General',
  `url` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `show_on_home` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES
(1,'President Cup 2026 Flight Allotment & Reporting Time','General',NULL,'notices/2kY0kq4jHidUdL4lXItOEp3ztoLIWXSNEupMwzar.pdf','All participating members and invited players are requested to report at the Starter Hut by 06:15 hrs on match day.\r\n\r\nHandicap certificates must be verified with the Tournament Secretary by 10 Sep 2026. Dress code: Formal Club Golf Attire.',1,1,'2026-08-26 13:09:05','2026-08-27 23:20:45'),
(2,'Green Aeration and Course Maintenance Schedule','General',NULL,NULL,'Respected Members, please note that Hole 3 and Hole 7 greens will undergo deep aeration and sand topdressing from Tuesday to Thursday. Temporary greens will be in play.\n\nThank you for your cooperation.',1,1,'2026-08-24 13:09:05','2026-08-27 13:09:05'),
(3,'Annual Membership Card Renewal & Handicap Updation 2026-2027','General',NULL,NULL,'Members are cordially requested to renew their annual subscription and collect the updated digital smart membership card from the club secretariat. Please submit two passport size photographs along with the renewal form.',1,1,'2026-08-21 13:09:05','2026-08-27 13:09:05'),
(4,'Special Dining & Member Banqueting Guidelines','General',NULL,NULL,'The Golf Cafe and Executive Lounge are available for private family dinners, corporate lunches, and celebrations with prior reservation. Please contact the Club Steward at least 48 hours in advance.',1,1,'2026-08-17 13:09:05','2026-08-27 13:09:05');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES
(1,'Membership Applying Procedure','membership-applying-procedure','<p>1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Who All Can Apply for Membership</u></strong>.&nbsp;&nbsp;Following are eligible to apply for the membership of Kurmitola Golf Club (KGC):</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Defence&nbsp;Service and Civil Government Officers</u></strong>.</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Serving Defence Services Officers and Retired officers of the rank of Colonel and above, or equivalent may apply for membership.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Serving civil government officers of the rank of Joint Secretary or equivalent and above (Serial 21 and above of Warrant of Precedence 1986) are eligible for Kurmitola Golf Club Membership. Officers serving on contract basis or part time are not eligible.</p><p>&nbsp;(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other retired defence services officers and civil government officers may apply for membership in the ‘Private Service Holder/Local Bangladeshi (Civil)’ category.</p><p>&nbsp;</p><p>b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Private Service Holder / Local Bangladeshi (Civil) Members</u></strong>.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>&nbsp;(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Must be a graduate.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Must be a regular tax payer (minimum personal income tax of BDT 1 lac per annum) and clean CIB record.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Senior Management level officers of reputed Multi National and National Companies having at least 7/8 years of working experience.</p><p>(4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chairman/Managing Director/Directors and Business Owners of reputed companies.</p><p>(5)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A company may be considered as reputed if it has a record of paying good amount as corporate taxes.&nbsp;</p><p>&nbsp;</p><p>c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Diplomats</u></strong>.</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All Ambassadors, High Commissioners and Embassy Officials of the rank of Second Secretary and above can become a member. Officers of all UN Organizations are also eligible as Diplomat Members:</p><p>(a)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;World Bank&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Asian Development Bank</p><p>(c)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNICEF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(d)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHO, UNDP and IDB etc.</p><p>&nbsp;</p><p>d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Non-Diplomat (Expatriates)</u></strong>.&nbsp;&nbsp;&nbsp;&nbsp;Foreign Nationals working in Bangladesh having VISA and valid Work permit in any reputed companies are eligible for membership.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Corporate Member</u></strong>.&nbsp;Prestigious corporate houses may apply for one, two, three or four member corporate membership. Members nominated by the corporation would be entitled to avail the club facilities and they can be replaced with new incumbent as per the terms and conditions of club membership. This facilities will be provided to those corporate houses who have made minimum contribution of BDT 5 million per annum under corporate social responsibility (this clause is applicable for local corporate house).&nbsp;</p><p>f.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Single Spouse</u></strong></p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After the demise of the honorable member, his/her spouse would be given ‘<strong>Single Spouse</strong>’ membership as per existing policy. Minor children (as per club record) of the deceased member will be considered as dependent member up to 25 years of age. Spouse concerned has to apply within one year from the date of demise of the member concerned to avail the ‘Single Spouse’ membership. Amongst the dependent members who would be playing golf regularly, after attaining 25 years of age may apply for full membership with discounted rate.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Golf playing dependent members, who have already crossed 25 years of age and were waiting to apply for full membership at a discounted rate, may be allowed to apply as of age and entrance fee mentioned in sub-para&nbsp;h. (2) above.</p><p>(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If a ‘<strong>Single Spouse</strong>’ member expires, his / her dependent members will continue to avail above mentioned facilities.</p><p><br></p><p>g.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Single Lady</u></strong>.&nbsp;For encouraging ladies to play golf in maximum number Single Ladies may be admitted by Executive Committee as Single Lady Member. As Single Lady Member her spouse and children are not entitled to use club facilities.&nbsp;</p><p>h.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Dependent Members</u></strong>.</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spouses of the members irrespective of age can become member of the club without paying additional entrance fee till the member is alive or his/her membership remains valid.&nbsp;</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Children of Members</u></strong>.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children of the members can remain dependent members up to the age of 25 years.&nbsp;After 25 years of age only the playing dependent members may apply for full-fledged membership as a local Bangladeshi. <strong><em>Applicants in this category are required to submit tax documents as applicable. </em></strong>Minimum age for dependent members to apply should be 25 years. Entrance fee and age limit for dependent members will be as under:</p><p>Ser</p><p>Age Limit</p><p>Entrance Fee for Children of Members</p><p>Armed Forces Members</p><p>Civil Members</p><p>1.</p><p>Up to 28 years</p><p>2,00,000.00</p><p>8,00,000.00</p><p>2.</p><p>Above 28 and up to 30 years</p><p>3,00,000.00</p><p>10,00,000.00</p><p>(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children over 30 years of age would not be considered as dependent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;members.&nbsp;</p><p>(4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dependent-turned regular members will avail all the facilities like a regular member except that their dependents will not be offered regular membership at discounted rate.</p><p>j.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Bright Junior Golfers</u>.&nbsp;&nbsp;&nbsp;</strong>Junior Golfers who are talented and their handicap is 5 (five) or below may apply for KGC membership. They will be tested for handicap and if found suitable (handicap-5 or below) will be awarded membership. This membership will remain valid up to the age of 18 (Eighteen) years. Their entrance fee is exempted.</p><p>k.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Special Temporary Member</u></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;National team players / coach may be awarded Special Temporary membership. This is to be approved by Executive Committee once</p><p>in a year. Their entrance fee is exempted. This will also be a single membership, thus their dependents will not enjoy any discount.</p><p>l.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Honorary Member.</u></strong><u>&nbsp;</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bangladeshi or Foreigners with outstanding National or International importance or outstanding contribution in sports will be awarded Honorary Membership. Their entrance fee is exempted.</p><p>&nbsp;</p><p>2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Applying Procedure</u></strong>.</p><p>a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An individual willing to become member of KGC would collect a prescribed Membership Form from the Chief Executive Officer paying Tk. 1,000.00 (One Thousand) in cash.</p><p>b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Membership Form must be deposited to the Club Secretariat with the following documents:&nbsp;</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Proposal Form and description form duly filled in and signed by the applicant.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Six copies of latest passport size photograph of the applicant.</p><p>(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recommendation from a permanent member of KGC.</p><p>(4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIN Certificate.</p><p>(5)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last three years Income Tax Certificate and Acknowledgement.</p><p>(6)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Certified true copy of the current year’s income tax return.</p><p>(7)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A cross cheque of the full entrance fee to be submitted along with the application form in favour of Kurmitola Golf Club.</p><p>(8)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Photocopy of National ID Card and Passport.</p><p>&nbsp;</p><p>3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Procedure for Security Clearance</u></strong>.&nbsp;KGC’s Membership awarding system may broadly be divided into following two categories basing on the procedure followed for obtaining security clearance from DGFI:</p><p>a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Category-1</u></strong>.</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No DGFI clearance is required for serving defence services officers (Colonel Equivalent and above), Defence Attaché / Military Attache, Diplomats, Single Spouse (Deceased Member), Champion Junior Golfers, Special Temporary Member &amp; Honorary Member.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On receipt of the application form it is placed before Vice President KGC for approval.</p><p>&nbsp;</p><p>b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Category-2</u></strong>.&nbsp;The application form of this category will be processed for obtaining DGFI clearance before awarding the permanent membership:</p><p>(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Retired Defence Service Officer.</p><p>(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Civil Government service Officer.</p><p>(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Local Bangladeshi.</p><p>(4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Corporate.</p><p>(5)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Expatriate Non-Diplomats.</p><p>(6)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Single Lady.</p><p>(7)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children of Members.</p><p>On receipt, the applications are placed before the Balloting Committee for scrutinizing the papers and interviewing the candidates (at a given date, preferably once in every month). The Chairman Balloting Committee recommends the candidates against each name by red ink and thereafter application forms are put up before the Vice President KGC for signature through a note sheet. After signature of Vice President applications are to be submitted to DGFI for security clearance. In the meantime applicants will be awarded Use Club Membership (UCM) on receipt of security clearance the same is again placed before the Vice President, KGC for final approval.</p><p><br></p><p>4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Induction Briefing</u></strong>.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After approval of membership by balloting committee, membership letter to be handed over to category-2 members by Club Captain. Club Captain will give an induction briefing during handing over of the letter.</p><p>5.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Payment System</u></strong>.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment of monthly subscription is the responsibility of all members to be paid regularly, Non-payment of monthly subscription, following procedure to be followed:</p><p>a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non payment of monthly subscription for consecutive three months - letter to be issued.&nbsp;</p><p>b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non payment of monthly subscription for consecutive six months – membership on hold.&nbsp;</p><p>c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non payment of monthly subscription for consecutive twelve months – membership to be suspended and may be cancelled.</p><p>d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reinstatement of membership applicant will have to pay 20% of entrance</p><p>fee applicable for his/her categories.</p><p><strong>Authority:</strong>&nbsp;&nbsp;Minutes of the 39th Executive Committee meeting held on 14 March 2012 vide No. 100/7/EC/Golf dated 22 March 2012 and Minutes of the 43rd EC Meeting held on 01 October 2015.</p><ul><li>&nbsp;</li></ul>',1,'2026-06-27 03:19:18','2026-06-27 07:28:48'),
(2,'Membership Fees','fees','{\"is_fees_data\":true,\"membership_fees\":[{\"category\":\"Serving Officers\",\"entry\":\"4000.00\",\"monthly\":\"500.00\",\"green_non\":\"200.00\",\"green_other\":\"100.00\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Retired Officers\",\"entry\":\"5000.00\",\"monthly\":\"500.00\",\"green_non\":\"200.00\",\"green_other\":\"100.00\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Civil Govt Officials (Serving\\/Retired)\",\"entry\":\"50,000.00\",\"monthly\":\"800.00\",\"green_non\":\"300.00\",\"green_other\":\"200.00\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Civilian\",\"entry\":\"3 Lac\",\"monthly\":\"1000.00\",\"green_non\":\"1,000.00\",\"green_other\":\"400.00\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Foreigners \\/Diplomats\",\"entry\":\"5 Lac\",\"monthly\":\"5000.00\",\"green_non\":\"1,000.00\",\"green_other\":\"800.00\",\"caddie\":\"600.00\",\"ball_boy\":\"200.00\"},{\"category\":\"Absentee Member (for defence officers only)\",\"entry\":\"-\",\"monthly\":\"25.00\",\"green_non\":\"-\",\"green_other\":\"-\",\"caddie\":\"-\",\"ball_boy\":\"-\"},{\"category\":\"Family Member (Svc\\/Retd)\",\"entry\":\"-\",\"monthly\":\"200.00 per family in addition to members subs\",\"green_non\":\"-\",\"green_other\":\"-\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Family Member (Civ Govt)\",\"entry\":\"-\",\"monthly\":\"300.00 per family in addition to members subs\",\"green_non\":\"-\",\"green_other\":\"-\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"},{\"category\":\"Family Member (Civilian)\",\"entry\":\"-\",\"monthly\":\"400.00 per family in addition to members subs\",\"green_non\":\"-\",\"green_other\":\"-\",\"caddie\":\"100.00\",\"ball_boy\":\"70.00\"}],\"other_charges\":[{\"category\":\"Regular Members\",\"practice\":\"100.00\",\"tournament\":\"200.00\",\"trolley\":\"50.00\",\"driving\":\"25.00\",\"locker\":\"150.00\",\"remark\":\"\"},{\"category\":\"Non Members\",\"practice\":\"300.00\",\"tournament\":\"500.00\",\"trolley\":\"100.00\",\"driving\":\"50.00\",\"locker\":\"0.00\",\"remark\":\"\"},{\"category\":\"Foreigners\",\"practice\":\"1000.00\",\"tournament\":\"2000.00\",\"trolley\":\"500.00\",\"driving\":\"100.00\",\"locker\":\"0.00\",\"remark\":\"\"}]}',1,'2026-06-27 03:19:19','2026-06-27 05:08:18');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES
(1,'Anwar','partners/oF0fhflGhKXvzLA9ZUXe6Ut1WiJ9lUIhuyBPJwiR.jpg',NULL,1,1,'2026-06-27 06:19:27','2026-06-27 06:19:27'),
(2,'Max','partners/1n4nbkW8wE1cz5zcGwe3P0EZEy2X3dUGSTEqcGMu.png',NULL,2,1,'2026-06-27 06:19:46','2026-06-27 06:19:46'),
(3,'Priyo','partners/BTh8s3dUj1qjLPHWThmG4RSr8DFP8pi31r6CYSTG.jpg',NULL,3,1,'2026-06-27 06:20:06','2026-06-27 06:20:06'),
(4,'Saif','partners/deb3r23tpt3cs8qVVcKZBg1IbHFml2R5GkXKsPN3.jpg',NULL,4,1,'2026-06-27 06:20:15','2026-06-27 06:20:15');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quick_links`
--

DROP TABLE IF EXISTS `quick_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quick_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quick_links`
--

LOCK TABLES `quick_links` WRITE;
/*!40000 ALTER TABLE `quick_links` DISABLE KEYS */;
INSERT INTO `quick_links` VALUES
(2,'Online Tournament Registration','Registration','http://bgcbd.com','quick-links/8JxiwncgYRTqXD6ErQosHRRENt0wetXocbAWgqUr.png',2,1,'2026-06-27 08:07:29','2026-06-27 08:12:55'),
(3,'Online Flight Schedule','Flight Schedule','http://bgcbd.com','quick-links/w1vkwoxBc2lCiHqKqOQFBykzq02LneHL6znCR50c.jpg',3,1,'2026-06-27 08:07:29','2026-06-27 08:13:16'),
(4,'Online Handicap Report','Handicap','http://bgfhandicap.org.bd/','quick-links/QwRKYykU91HKwwnKwKNAaBDknDFjqS1BHnQD1IXK.jpg',4,1,'2026-06-27 08:07:29','2026-06-27 08:13:38');
/*!40000 ALTER TABLE `quick_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scorecards`
--

DROP TABLE IF EXISTS `scorecards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `scorecards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `player_name` varchar(255) NOT NULL,
  `member_id` varchar(255) DEFAULT NULL,
  `competition` varchar(255) DEFAULT NULL,
  `tournament_id` bigint(20) unsigned DEFAULT NULL,
  `played_at` date NOT NULL,
  `tee_type` varchar(255) NOT NULL DEFAULT 'men',
  `round_type` varchar(255) NOT NULL DEFAULT '9_holes',
  `handicap` int(11) NOT NULL DEFAULT 0,
  `scores_r1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`scores_r1`)),
  `scores_r2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`scores_r2`)),
  `gross_r1` int(11) NOT NULL DEFAULT 0,
  `gross_r2` int(11) DEFAULT NULL,
  `gross_total` int(11) NOT NULL DEFAULT 0,
  `net_score` decimal(5,1) NOT NULL DEFAULT 0.0,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `marker_name` varchar(255) DEFAULT NULL,
  `player_signature` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scorecards_user_id_foreign` (`user_id`),
  KEY `scorecards_tournament_id_foreign` (`tournament_id`),
  KEY `scorecards_created_by_foreign` (`created_by`),
  KEY `scorecards_approved_by_foreign` (`approved_by`),
  CONSTRAINT `scorecards_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `scorecards_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `scorecards_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `scorecards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scorecards`
--

LOCK TABLES `scorecards` WRITE;
/*!40000 ALTER TABLE `scorecards` DISABLE KEYS */;
INSERT INTO `scorecards` VALUES
(1,2,'Salman Rahman','BGC-260002','President Cup Golf Tournament 2026',1,'2026-08-26','men','9_holes',12,'[5,8,5,6,7,5,6,6,5]',NULL,53,NULL,53,41.0,'approved','Lt Col Eshraq',NULL,'Official Bogura Golf Club 9-Hole Match from paper scorecard.',NULL,NULL,NULL,NULL,'2026-08-27 22:01:22','2026-08-27 22:32:44'),
(2,NULL,'Lt Col Eshraq',NULL,'President Cup Golf Tournament 2026',NULL,'2026-08-26','men','9_holes',18,'[7,10,5,7,11,4,8,4,7]',NULL,63,NULL,63,45.0,'approved','Lt Col Kamrul',NULL,'Tough putting on Hole 5 Bermuda green.',NULL,NULL,NULL,NULL,'2026-08-27 22:01:22','2026-08-27 22:28:26'),
(3,NULL,'KO Ashif',NULL,'Monthly Medal Round',NULL,'2026-08-24','men','9_holes',14,'[6,12,9,6,10,4,7,6,5]',NULL,65,NULL,65,51.0,'approved','Lt Col Kamrul',NULL,'BGC 9-Hole afternoon fixture.',NULL,NULL,NULL,NULL,'2026-08-27 22:01:22','2026-08-27 22:28:26');
/*!40000 ALTER TABLE `scorecards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('dYolc1NRu8S2IXrEW0LOLm81AuFnftI8fM7VEIsa',NULL,'203.202.255.98','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJwVFdXV3Rmc1ZaNHVqeEo2a3ZoR09UcmhUWHdFQWhqeW9QckhBUTlrIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788140112),
('lMm0SmSKvIpimSgOy6Isc7Oiy7eswjKi6NjFJ6ue',NULL,'10.11.0.1','Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)','eyJfdG9rZW4iOiJxYmtIM1E3SENtNWh6THEwdUJsZVBncmNLZXBJQWlNVzNDWnNwUFFTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2JnYy53ZWJhcHBzLmVlIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1788127669),
('oSApANOHcrniVQPXwxbN6Om3gplRS8ik7fqzUVZO',NULL,'10.11.0.1','WhatsApp/2.23.20.0','eyJfdG9rZW4iOiJVSnVSQXlvVERldEJ1RWJ2S21IbUtxeFdNVzVTTExIbFF4NUNRRzRKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788098283),
('OZokK8buIsrUZTC0SaLoleMM9aerRlJRXdNnyA7O',NULL,'10.11.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJpRFdiTE83VDd0M3dvSkJQaG1oWlBOSG9JV1BHeXZRMVJQbzNxekhrIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788098013),
('W94MZAI8VVB2g3jL5ooHNgtFIWbLRia6nzM2003D',NULL,'203.202.255.98','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0','eyJfdG9rZW4iOiJDOGNia1JnR3Z6NzRoRURyNDZtazFpNXVjRUdmMUN0TFRpdk1TUTE5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788148417),
('WhIwdd8pt2FQ15eo5PNZgKFNp2NYlUJo587VG6bG',NULL,'10.11.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJjNzVvZTZBaWZkMTVEYnVvdDAzb29BSWV1R0RkTjhZMFY3SW5DMUg4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788098480),
('x0pH8nB6pMwwk22R45QhD6MyuNGOIpSWJFgehFt5',NULL,'10.11.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJtV0tzV3NtZVlJMFFzWjVYMDN5RlNrVkRpS0dOWmtJdDNyNVRwNGhGIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788140016);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES
(1,'site_name','Bogura Golf Club','2026-06-17 19:15:17','2026-06-17 19:19:18'),
(2,'contact_email','bogragolf@gmail.com','2026-06-17 19:15:17','2026-06-27 06:00:49'),
(3,'address',NULL,'2026-06-17 19:15:17','2026-06-17 19:15:17'),
(4,'logo_path','/images/bgc-logo.png','2026-06-17 19:15:17','2026-08-27 20:42:31'),
(5,'map_url','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14510.983949826353!2d89.37000000000002!3d24.805000000000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc54e7ef63e3fb%3A0x6b8f8883656360c7!2sBogura%20Golf%20Club!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd','2026-06-27 04:52:09','2026-08-27 13:09:05'),
(6,'contact_phone',NULL,'2026-06-27 06:00:49','2026-06-27 06:00:49'),
(7,'footer_about_us','Tee off at Bogra Golf Club in Majhira, Bangladesh! ⛳️ Experience our beautifully maintained 9-hole course, pristine practice facilities, and a welcoming clubhouse perfect for relaxing after your round.','2026-06-27 08:07:49','2026-06-27 08:09:44'),
(8,'footer_contact_phone_civil','+88 02 12345678','2026-06-27 08:07:49','2026-06-27 08:07:49'),
(9,'footer_contact_phone_army','+88 02 1234','2026-06-27 08:07:49','2026-06-27 08:07:49'),
(10,'footer_contact_email','bogragolf@gmail.com','2026-06-27 08:07:49','2026-06-27 08:10:15'),
(11,'footer_copyright','All Rights Reserved by Bogura Golf Club © 2026','2026-06-27 08:07:49','2026-06-27 08:07:49'),
(12,'footer_useful_links','[{\"title\":\"Home\",\"url\":\"\\/\"},{\"title\":\"About Us\",\"url\":\"\\/about\"},{\"title\":\"Contact Us\",\"url\":\"\\/contact-us\"},{\"title\":\"Privacy Policy\",\"url\":\"#\"}]','2026-06-27 08:07:49','2026-06-27 08:07:49'),
(13,'footer_social_links','[{\"platform\":\"f\",\"url\":\"#\"}]','2026-06-27 08:07:49','2026-06-27 08:08:03'),
(14,'footer_payment_methods','[{\"name\":\"VISA\"},{\"name\":\"MasterCard\"},{\"name\":\"bKash\"},{\"name\":\"Nagad\"}]','2026-06-27 08:07:49','2026-06-27 08:07:49');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament_registrations`
--

DROP TABLE IF EXISTS `tournament_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_registrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `player_name` varchar(255) NOT NULL,
  `member_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `handicap` int(11) NOT NULL DEFAULT 0,
  `category` varchar(255) NOT NULL DEFAULT 'Regular Men',
  `t_shirt_size` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'registered',
  `notes` text DEFAULT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tournament_registrations_tournament_id_foreign` (`tournament_id`),
  KEY `tournament_registrations_user_id_foreign` (`user_id`),
  CONSTRAINT `tournament_registrations_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tournament_registrations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_registrations`
--

LOCK TABLES `tournament_registrations` WRITE;
/*!40000 ALTER TABLE `tournament_registrations` DISABLE KEYS */;
INSERT INTO `tournament_registrations` VALUES
(1,1,2,'Lt Col Kamrul','BGC-260001','kamrul@bgcbd.com','01711223344',12,'Regular Men','L','confirmed','Caddy request: Senior caddy.','2026-08-28 04:09:55','2026-08-27 22:09:55','2026-08-27 22:09:55'),
(2,1,NULL,'Lt Col Eshraq',NULL,'eshraq@bgcbd.com','01722334455',18,'Regular Men','XL','confirmed','Early morning tee-off preferred.','2026-08-28 04:09:55','2026-08-27 22:09:55','2026-08-27 22:28:26'),
(3,1,NULL,'Dr. Nadia Sultana',NULL,'nadia@example.com','01733445566',22,'Ladies','M','confirmed',NULL,'2026-08-28 04:09:55','2026-08-27 22:09:55','2026-08-27 22:28:26');
/*!40000 ALTER TABLE `tournament_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament_results`
--

DROP TABLE IF EXISTS `tournament_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_results` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sponsored_by` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_results`
--

LOCK TABLES `tournament_results` WRITE;
/*!40000 ALTER TABLE `tournament_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `tournament_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('upcoming','live','completed') NOT NULL DEFAULT 'upcoming',
  `location` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournaments`
--

LOCK TABLES `tournaments` WRITE;
/*!40000 ALTER TABLE `tournaments` DISABLE KEYS */;
INSERT INTO `tournaments` VALUES
(1,'President Cup Golf Tournament 2026','The prestigious annual 18-hole championship featuring club members, division commanders, and invited guest golfers with individual handicap categories.','2026-09-10','2026-09-12','upcoming','Bogura Golf Course',NULL,NULL,1,1,'2026-08-27 13:09:05','2026-08-27 15:29:24'),
(2,'11 Infantry Division Championship Trophy','Annual stroke play competition for military and civil officers. Tee off begins at 06:30 hrs followed by prize giving ceremony at the main banquet lounge.','2026-10-01','2026-10-03','upcoming','Main 9-Hole Course',NULL,NULL,1,2,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(3,'Autumn Corporate Invitational Golf Match','A sponsored corporate invitational match designed for business leaders, sports enthusiasts, and club patrons featuring four-ball scramble format.','2026-10-26','2026-10-27','upcoming','Bogura Golf Club',NULL,NULL,1,3,'2026-08-27 13:09:05','2026-08-27 13:09:05'),
(4,'Junior & Ladies Amateur Golf Cup','Special developmental golf tournament for budding young talents and lady golfers in Bogura region with clinic and training sessions.','2026-11-15','2026-11-16','upcoming','Driving Range & Practice Greens',NULL,NULL,1,4,'2026-08-27 13:09:05','2026-08-27 13:09:05');
/*!40000 ALTER TABLE `tournaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `member_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'member',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_superadmin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `rank_designation` varchar(255) DEFAULT NULL,
  `appointment` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `addresses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`addresses`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_member_id_unique` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'BGC-260001','Super Admin','superadmin@bgcbd.com','2026-08-01 09:31:05','$2y$12$0P89/k2JS2q75QKcMbJIW.cYRPz.DZJe/5Jyjms5VV/Q1ZttPi1bK','super_admin',1,1,'dDmJIeWVgBykTmagwBZyJOgERafzoNpjyGSSAQnjZQw4RHB7mOVB2UQbaJU6','2026-06-17 16:10:43','2026-08-01 09:31:05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(2,'BGC-260002','Salman Rahman','member@bgcbd.com','2026-08-01 09:31:06','$2y$12$WJlE.f1/ARD7v.PsWoILS.t2Qnm52TxNihe4zveGBWYCqzFL64IB6','member',1,0,'lBSoByRFfRi1dYsYimTHwlRMTDohTD6jySrVnTGteHBBHg1W5sn3rFAwEoF0','2026-06-17 18:59:22','2026-08-27 15:06:54','2138','01996517657','Bangladesh','Captain','ICT OFFR','Armed Forces','Bangladesh Army','profile_pictures/nMTJKZIjjeFm4rvT4XmZLrJTLwIWrblklMJ3aJ0v.jpg',NULL),
(3,'BGC-260003','Admin','admin@bgcbd.com','2026-08-01 09:31:06','$2y$12$qkYXfNiA2YMUD4ZtPVryTOgj6Ii5V4yw4PMiy/YHxuIRwCjZdtABW','admin',1,0,NULL,'2026-06-27 04:53:49','2026-08-27 20:47:17',NULL,NULL,'Bangladesh',NULL,NULL,NULL,NULL,'profile_pictures/9g2o6xNwYgbpOMztOAhpxRYm9Bf2lSdj8X2eOvw9.jpg',NULL),
(5,'BGC-260005','Demo User (BGC)','user@bgcbd.com','2026-08-01 09:31:07','$2y$12$hx.XN9VtrwsrvkcDBT1c7u7BfTU0MviaFVNKtMVyRvRCW.5w50xlu','member',1,0,NULL,'2026-08-01 09:31:07','2026-08-27 21:23:56',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `winner_lists`
--

DROP TABLE IF EXISTS `winner_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `winner_lists` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `winner_lists`
--

LOCK TABLES `winner_lists` WRITE;
/*!40000 ALTER TABLE `winner_lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `winner_lists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 10:25:11
