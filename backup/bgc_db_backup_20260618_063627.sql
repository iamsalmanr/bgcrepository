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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
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
('0hBWh6nhunfAKMJSzGmZhzkDHYQE21og4BkozcfF',NULL,'127.0.0.1','curl/8.5.0','eyJfdG9rZW4iOiIxSEhZalpKSHNLV2J1Tlk5QlFtVUJDZ2lGMEFaTDlwbjk1czh4aTlsIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781735948),
('1plpMPBWtAH8ELojkaTLlB7A0Bzi3H2xzhq2V2ek',NULL,'44.244.52.248','Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.155 Mobile Safari/537.36','eyJfdG9rZW4iOiJOYXFVZ3FWVUx4b0RIenNXVTNwcFFtWDlMdnhqNmJrOUxLY2E1a0I1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781742365),
('6i6gQufLB0KqnjxVlZECpOtVmUxekoxJuSZOZonE',NULL,'44.251.220.53','Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36','eyJfdG9rZW4iOiJRWFJNdm94NTlENnFJM3hNYldqWGlVSkNFM2h1VTN6ZmZJdjY1QkF0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2JnYy53ZWJhcHBzLmVlIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1781740989),
('6Kh1Bhn0IMM4VwSUscUwU1y9CoK95ymhGytoWOrN',NULL,'103.179.199.250','WhatsApp/2.23.20.0','eyJfdG9rZW4iOiJtUkQ3Yzh3bzVyVE5iZFdzNXBxeHBBSG1Ha3RxSmI5T2h2Sjg0cVoyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740055),
('7t1IxSKEWELztkKVZDqZQJPjomyhQSoMhVkAim4X',NULL,'103.179.199.250','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJndDJWTGRjaFNtdlR4UUNCQmcwRnhDRGJDb1ZpUXNkVnRNZUNyUlVmIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2JnYy53ZWJhcHBzLmVlIiwicm91dGUiOm51bGx9fQ==',1781742017),
('7tymx8c7FCbbtQ6J0NjzaH4MwqYWOiob693ZuX2g',NULL,'155.2.228.196','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJnU3ZRazVzNHphVG9rakF0bVk4dlFZYkFmZUlJMUNsTzI3d1NkcUFEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781738413),
('86P76iGGOgXTSKDUExNd0W8rT8ELHdkFxoFJslL1',NULL,'103.15.42.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJLdTNhMEVrc1h5Z1gwN2xwQVhjZkxtTm9TT0dOcmlYMmk0bWxHaHpiIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740228),
('bWNrYCBm0BWySEWFIqcZgBQ1PRMrp9vsSQc8g4ry',NULL,'20.115.49.134','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXcjNGTWQzMjFVSUZ2Y2R0dE1XZmtxbXVBWUR4eHQ2M05sT1VyNHN5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740452),
('G2inVwy8OWp0hwC3lk7fWDlabcOugQvxbwePHTWc',NULL,'44.247.129.113','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJhOVkxRlBSU2pwWkpKakhhNEUydXd5WDEzVDE4aGhyZE02U2lLQ3p2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3d3dy5iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781741879),
('is3TEiQbb2RFW3eeiIkvLDxn8mZ377TY9ayUm5Vj',NULL,'216.73.216.26','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)','eyJfdG9rZW4iOiI1dUswMW5oeDd3UjZkVldyZklzZ2pZWnpKaDFWZFZPekRIUVJnUjFIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC93d3cuYmdjLndlYmFwcHMuZWUiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1781737760),
('oyFnkPqAbd8pw2iztAyUsbg3FNJbzjan7eE8KaZ9',NULL,'103.179.199.250','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJISFlzY2owbUQ4TUZPcmVNS2dMbWI4NnF4YnNLTXFyRjdaOTVXTkM0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740218),
('qjciAhJtJjzftW3aef4WkiUe9b29Y5kYfbI0Scjq',NULL,'37.111.227.210','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJxamRvS2lieXFiMXh3ZjN2bG51YU9scnI1STEyMWxqZmtINGtNSGlwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740219),
('QScJw1VvQ1u9hqpc8aaGxlyXqjtY2L4RkjVVcQDU',NULL,'44.251.220.53','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582','eyJfdG9rZW4iOiJ1S1ZhdURmR3lFemxGNWt0d1dvaHdNcjF5M2J6V2plQWRMOXFOVDllIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2JnYy53ZWJhcHBzLmVlIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1781740989),
('rbuO6gWPA5ryDuvLFKP2MC4hvv180p4oPh1aZQlW',NULL,'37.111.224.235','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJDWHFEbnBDNlNxT1dwR2pSdVVPd3dPWTRRUTVicllSazN4QlRYbngyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740097),
('Vtd0JoQIBrGhjLUYY88adbTvprchfVgiiIoHzm0V',NULL,'44.244.52.248','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.155 Safari/537.36 Edge/18.19582','eyJfdG9rZW4iOiI4eHJ2TUZwdkFnVDhXWVJNT3Z0UWV1SFliTE5UNWxPano2RWhmWWtXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781742355),
('wuwPMMez38lmcADd8R9sUwkzvzERv3NANWNeji50',NULL,'216.73.216.26','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)','eyJfdG9rZW4iOiJlM1NLSGV1ZzF5S3NTS0ZWWGlsa3VvZzFFWjZESWRadGd5ZWczWmZKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781737983),
('xSBpmTp5WpcRKcGyEGS18rXky4hY2B4lNoDqhPsR',NULL,'103.179.199.250','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJjN1J5Z3lzTjNyMUtSNnc1dGdPMDBINTF2d3VSZEJRNXlWd2hOSkNOIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781740116),
('ZskqsaL6vrUvG5hQCv1oYFrz7UUrc0vdY4y5h0M6',NULL,'44.247.129.113','Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJ2WFA0R2NtYnRJSmxtU2dnQXdTaERHWUlGS0xoSkJrS0YwV2FhRjl6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3d3dy5iZ2Mud2ViYXBwcy5lZSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781741880);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_superadmin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Super Admin','superadmin@bgc.com','2026-06-17 16:10:42','$2y$12$DZ7Bg9VyChqzNWh.MnGA5uTiSb.aplUorE12y75QkyqSHOlvC8UPq',1,'GqoELh6XyE2QkFAhxBPQqUR0Uoj3JLvdHUWx8N82Mn7aC8vBTntk5xfWhrNv','2026-06-17 16:10:43','2026-06-17 16:10:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-18  6:36:27
