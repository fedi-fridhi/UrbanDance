-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2024 at 07:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `urbandance`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL DEFAULT 'No Description provided',
  `price` int(11) NOT NULL,
  `bannersrc` varchar(250) NOT NULL,
  `coachid` int(11) NOT NULL,
  `e_date` datetime NOT NULL,
  `e_type` varchar(30) NOT NULL DEFAULT 'none',
  `localisation` varchar(50) NOT NULL,
  `limit_subs` int(11) NOT NULL,
  `nbr_subs` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `price`, `bannersrc`, `coachid`, `e_date`, `e_type`, `localisation`, `limit_subs`, `nbr_subs`) VALUES
(31, 'Contemporary', 'join us!!', 50, 'uploads/colab2.mp4', 24, '2024-05-01 11:20:00', 'dance', 'UD Ain Zaghouan', 99, 1),
(33, 'Flexibilty', 'join us!!', 50, 'uploads/colab1.mp4', 25, '2024-05-10 17:00:00', 'flex', 'UD manzah5', 99, 1),
(35, 'Commercial', 'join us!!', 100, 'uploads/colab.mp4', 26, '2024-05-25 18:00:00', 'dance', 'UD AinZaghouan', 1000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_subs`
--

CREATE TABLE `event_subs` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_subs`
--

INSERT INTO `event_subs` (`id`, `event_id`, `user_id`) VALUES
(32, 31, 23),
(33, 33, 23),
(34, 35, 23);

-- --------------------------------------------------------

--
-- Table structure for table `groupes`
--

CREATE TABLE `groupes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `coachid` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `nbr_limit` int(11) NOT NULL,
  `nbr_students` int(11) NOT NULL,
  `lundi` int(11) NOT NULL,
  `mardi` int(11) NOT NULL,
  `mercredi` int(11) NOT NULL,
  `jeudi` int(11) NOT NULL,
  `vendredi` int(11) NOT NULL,
  `samedi` int(11) NOT NULL,
  `dimanche` int(11) NOT NULL,
  `horaire_debut` time NOT NULL,
  `horaire_fin` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groupes`
--

INSERT INTO `groupes` (`id`, `name`, `type`, `coachid`, `price`, `nbr_limit`, `nbr_students`, `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`, `samedi`, `dimanche`, `horaire_debut`, `horaire_fin`, `created_at`, `updated_at`) VALUES
(1, 'Groupe A', 'FLEX', 25, 150, 20, 1, 0, 1, 0, 1, 0, 0, 0, '12:00:00', '13:00:00', '2024-04-30 18:37:27', '2024-04-30 20:53:58'),
(2, 'Groupe B', 'FLEX', 25, 150, 20, 1, 0, 0, 1, 0, 0, 1, 0, '17:00:00', '18:00:00', '2024-04-30 18:37:58', '2024-04-30 20:54:01'),
(3, 'GROUPE TEST', 'FLEX', 25, 150, 20, 1, 0, 1, 0, 0, 1, 0, 0, '17:00:00', '18:00:00', '2024-04-30 18:40:27', '2024-04-30 21:30:07'),
(4, 'Groupe a dance', 'URBANDANCE', 28, 150, 20, 0, 1, 0, 0, 1, 1, 0, 0, '17:00:00', '18:00:00', '2024-04-30 18:40:55', '2024-04-30 18:40:55'),
(5, 'Groupe B dance', 'URBANDANCE', 29, 150, 20, 1, 1, 0, 1, 0, 0, 1, 0, '17:00:00', '18:00:00', '2024-04-30 18:41:15', '2024-04-30 20:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `groupe_students`
--

CREATE TABLE `groupe_students` (
  `id` int(11) NOT NULL,
  `groupeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `inscription_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groupe_students`
--

INSERT INTO `groupe_students` (`id`, `groupeId`, `userId`, `inscription_date`) VALUES
(1, 3, 23, '2024-04-30 20:50:22'),
(2, 1, 23, '2024-04-30 20:53:58'),
(3, 2, 23, '2024-04-30 20:54:01'),
(4, 5, 23, '2024-04-30 20:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(30) NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'User',
  `address` varchar(30) NOT NULL DEFAULT 'n/a',
  `country` varchar(30) NOT NULL DEFAULT 'n/a',
  `region` varchar(30) NOT NULL DEFAULT 'n/a',
  `codepostal` varchar(30) NOT NULL DEFAULT 'n/a',
  `phone` varchar(30) NOT NULL DEFAULT '+216',
  `picturesrc` varchar(255) NOT NULL DEFAULT 'assets/profile.jpg',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_expiry` int(11) NOT NULL DEFAULT 0,
  `reset_code` varchar(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `address`, `country`, `region`, `codepostal`, `phone`, `picturesrc`, `created_at`, `updated_at`, `reset_expiry`, `reset_code`) VALUES
(23, 'wassimbenazzoun.tn@gmail.com', '$2y$10$PtD3o3eTGuoUgj1Vql/51.6ll21YiZdO191J//4L8SinBPpbZOXqi', 'Wassim Ben Azzoun', 'Admin', '64 rue 11061', 'Tunisia', 'Tunis', '2066', '+21658901316', 'http://localhost/api/profile/23.png', '2024-04-30 18:16:12', '2024-04-30 20:51:54', 1714512856, '771867'),
(24, 'rahma@gmil.com', '$2y$10$sfKbxauFmXbKTkL4JRM/DuFS0Q3Tqeh0zqzvr0Ao3O3/GyxkK95VS', 'Rahma ben aissa', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:19:47', '2024-04-30 18:20:15', 0, '0'),
(25, 'eyatlili08@gmail.com', '$2y$10$/kg84Qg/s.wtgKXa5b5UM.eonZluUgui2rUBXeMmsjJV/OWdDPmoa', 'Tlili Eya', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:23:25', '2024-04-30 18:23:49', 0, '0'),
(26, 'janekim@gmail.com', '$2y$10$ZYIDxKa8dNjynjEIoY5.mObo8t9BZJM9dRjfshsMgYQL/cOmM00/.', 'Jane Kim', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:24:59', '2024-04-30 18:25:20', 0, '0'),
(27, 'ghaliabelhajamor@gmail.com', '$2y$10$o.XcC/ZenR5qR0XQj85paevdTkxVFymkM5pxJkq.35LbEYhn.EP.S', 'ghalia', 'Admin', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:28:35', '2024-04-30 18:28:54', 0, '0'),
(28, 'KALIFA@gmail.com', '$2y$10$sg7CF2pHNufbV1tZfskCZ.xuQG4.9tYaw2cBCRyQaRN2pmMIAxj3G', 'KALIFA', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:38:24', '2024-04-30 18:39:02', 0, '0'),
(29, 'beaubrun@gmail.com', '$2y$10$CVhJytuJ9EzWp9oa1FdH7uv2jE.QoJaeVM3432A6Vs/zNKO1YFzB2', 'Beaubrun', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:38:37', '2024-04-30 18:39:11', 0, '0'),
(30, 'fedi@gmail.com', '$2y$10$VoLwboUPFJVahn7wFcqPvO5RY7nqlD9H1bHKQfF0yFJbhR8rS53WK', 'fedi fridhi', 'Coach', 'n/a', 'n/a', 'n/a', 'n/a', '+216', 'assets/profile.jpg', '2024-04-30 18:39:29', '2024-04-30 18:40:15', 0, '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_subs`
--
ALTER TABLE `event_subs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groupes`
--
ALTER TABLE `groupes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groupe_students`
--
ALTER TABLE `groupe_students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `event_subs`
--
ALTER TABLE `event_subs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `groupes`
--
ALTER TABLE `groupes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `groupe_students`
--
ALTER TABLE `groupe_students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_subs`
--
ALTER TABLE `event_subs`
  ADD CONSTRAINT `fk_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
