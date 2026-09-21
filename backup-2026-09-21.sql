PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0000_lame_silver_samurai.sql','2026-09-20 21:29:00');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0001_eminent_solo.sql','2026-09-20 21:33:35');
CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "admin_users" ("id","full_name","created_at") VALUES('admin','Admin','2026-09-20T22:26:25.280Z');
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_url` text,
	`position` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "categories" ("id","name","slug","description","image_url","position","is_visible","created_at","updated_at") VALUES('5b2d5bd2-d445-4e04-a4ff-88541f4652da','Huiles végétales','huiles',NULL,'/uploads/0-1789243973507.webp',0,1,'2026-09-12T20:05:07.289Z','2026-09-18T11:25:30.666Z');
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "contact_messages" ("id","name","email","phone","subject","message","status","created_at") VALUES('0cb7bf9f-f966-45de-be38-d2e394a41b6f','Oumayma','oumayma0203@gmail.com',NULL,'Sujet','Message','new','2026-09-19T22:57:37.352Z');
INSERT INTO "contact_messages" ("id","name","email","phone","subject","message","status","created_at") VALUES('c208408a-90bf-4730-9cb6-67b048093853','Oumayma','oumayma0203@gmail.com',NULL,'Sujet','Message','new','2026-09-19T23:16:17.856Z');
INSERT INTO "contact_messages" ("id","name","email","phone","subject","message","status","created_at") VALUES('87a68351-d562-4957-92c9-0864369456e2','Oumayma Chtioui','oumayma0203@gmail.com',NULL,'Sujet','Message','new','2026-09-21T11:32:56.387Z');
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`city` text,
	`phone` text,
	`opening_hours` text,
	`maps_url` text,
	`latitude` real,
	`longitude` real,
	`description` text,
	`is_visible` integer DEFAULT true NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`unit_price` real NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal` real NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('a0764d41-98ec-438b-bba0-a0fc33b3502b','9026367d-ae37-44cf-b9fc-ff2e85f40fb1','b7c1b7b7-8aa2-49ac-ad30-4c399ce13cda','Déodorant naturel',20,2,40,'2026-09-17T20:52:56.210Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('69b328a5-bc62-4cfd-a9cb-651aa223a64e','9026367d-ae37-44cf-b9fc-ff2e85f40fb1','ff869fc5-b9cf-4451-bbac-59bd4ab72d21','Sérum Concentré Acide Hyaluronique',70,5,350,'2026-09-17T20:52:56.210Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('f623ee81-96b3-49f8-bae0-6a7fea328675','9ad9afe6-9e18-41ef-8648-88eb37b4433b',NULL,'Huile D''Amande Douce',60,1,60,'2026-08-24T11:11:32.287Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('e0748035-deaf-4055-b4d0-4999c5c30211','e44bc78b-eb51-4a00-953a-511ea183030d',NULL,'Huile D''Amande Douce',60,1,60,'2026-08-24T11:11:42.552Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('49e16022-f981-49d4-9564-c55c146589d5','18cc0f29-8ca2-4769-9be5-76b31db0119c','ff869fc5-b9cf-4451-bbac-59bd4ab72d21','Sérum Concentré Acide Hyaluronique',0,1,0,'2026-09-18T21:27:05.787Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('2d391b8e-16e6-415b-a302-fe1361ad655a','18cc0f29-8ca2-4769-9be5-76b31db0119c','b7c1b7b7-8aa2-49ac-ad30-4c399ce13cda','Déodorant naturel',0,1,0,'2026-09-18T21:27:05.787Z');
INSERT INTO "order_items" ("id","order_id","product_id","product_name","unit_price","quantity","subtotal","created_at") VALUES('8f69cdce-0bf7-4155-af1e-b525762576af','c5c151bc-0b7c-430f-9a98-4f0867d4b951','b7c1b7b7-8aa2-49ac-ad30-4c399ce13cda','Déodorant naturel',0,1,0,'2026-09-21T11:33:25.343Z');
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_email` text,
	`customer_address` text NOT NULL,
	`customer_city` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'Nouvelle' NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "orders" ("id","order_number","customer_name","customer_phone","customer_email","customer_address","customer_city","notes","status","total_amount","created_at","updated_at") VALUES('9ad9afe6-9e18-41ef-8648-88eb37b4433b','MS-000001','Oumayma','99176093','oumayma0203@gmail.com','Monastir','Monastir','Testing order','Nouvelle',60,'2026-08-24T11:11:31.949Z','2026-08-24T11:11:31.949Z');
INSERT INTO "orders" ("id","order_number","customer_name","customer_phone","customer_email","customer_address","customer_city","notes","status","total_amount","created_at","updated_at") VALUES('e44bc78b-eb51-4a00-953a-511ea183030d','MS-000002','Oumayma','99176093','oumayma0203@gmail.com','Monastir','Monastir','Testing order','Annulée',60,'2026-08-24T11:11:42.221Z','2026-08-24T11:18:24.478Z');
INSERT INTO "orders" ("id","order_number","customer_name","customer_phone","customer_email","customer_address","customer_city","notes","status","total_amount","created_at","updated_at") VALUES('9026367d-ae37-44cf-b9fc-ff2e85f40fb1','MS-C5YVVVBM','Oumayma Chtioui','99176093','oumayma0203@gmail.com','Monastir','Monastir',NULL,'Nouvelle',390,'2026-09-17T20:52:55.684Z','2026-09-17T20:52:55.684Z');
INSERT INTO "orders" ("id","order_number","customer_name","customer_phone","customer_email","customer_address","customer_city","notes","status","total_amount","created_at","updated_at") VALUES('18cc0f29-8ca2-4769-9be5-76b31db0119c','MS-SZ4V658L','Oumayma Chtioui','99176093','oumayma0203@gmail.com','Monastir','Monastir',NULL,'Nouvelle',0,'2026-09-18T21:27:05.436Z','2026-09-18T21:27:05.436Z');
INSERT INTO "orders" ("id","order_number","customer_name","customer_phone","customer_email","customer_address","customer_city","notes","status","total_amount","created_at","updated_at") VALUES('c5c151bc-0b7c-430f-9a98-4f0867d4b951','MS-QAS3KHTP','Oumayma Chtioui','99498711','oumayma0203@gmail.com','Monastir','Monastir','Testing DB Migration','Nouvelle',0,'2026-09-21T11:33:25.306Z','2026-09-21T11:33:25.306Z');
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`url` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('10f4b718-2950-416c-9c05-e71cc543c332','ff869fc5-b9cf-4451-bbac-59bd4ab72d21','/uploads/1-1786898636125-Capture-d-A-cran-2026-08-16-173753.png',1,0,'2026-08-16T16:43:59.210Z');
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('c5850da9-aed5-48a9-8298-8cc192be7dd1','ff869fc5-b9cf-4451-bbac-59bd4ab72d21','/uploads/2-1786898311911-image_2026-08-16_173830116.png',0,1,'2026-08-16T16:38:34.327Z');
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('ea9a155f-0d59-43aa-892b-2932e0e1cc6e','b7c1b7b7-8aa2-49ac-ad30-4c399ce13cda','/uploads/3-1786899682251-Capture-d-A-cran-2026-08-16-120753.png',0,1,'2026-08-16T17:01:30.037Z');
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('38d1c35b-72d2-49e3-9b1b-59cb5b56fba8','55417622-b906-4bd0-bd67-a876a9a3a3b2','/uploads/4-1789732462666.webp',0,1,'2026-09-18T11:54:23.830Z');
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('fcfe6e96-a47f-41a8-8029-e4e0920424d0','a25f3ee6-38ae-46f7-937c-2c0908d18571','/uploads/5-1789732463943.webp',0,1,'2026-09-18T11:54:25.615Z');
INSERT INTO "product_images" ("id","product_id","url","position","is_primary","created_at") VALUES('0eaf89a8-173a-49c7-abf2-1c9f54701a2a','a25f3ee6-38ae-46f7-937c-2c0908d18571','/uploads/6-1789850616235.png',1,0,'2026-09-19T20:43:43.758Z');
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`full_description` text,
	`category_id` text,
	`price` real,
	`price_visible` integer DEFAULT false NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`sku` text,
	`volume` text,
	`ingredients` text,
	`benefits` text,
	`usage_instructions` text,
	`precautions` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`whatsapp_enabled` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
INSERT INTO "products" ("id","name","slug","short_description","full_description","category_id","price","price_visible","is_available","sku","volume","ingredients","benefits","usage_instructions","precautions","tags","is_featured","is_published","position","whatsapp_enabled","created_at","updated_at") VALUES('b7c1b7b7-8aa2-49ac-ad30-4c399ce13cda','Déodorant naturel','deodorant-naturel','ستقبلي فصل الصيف برائحة منعشة و ودعي مشكلة العرق معا stick ماري سانس الطبيعي 🕊️🌿تركيبة 100% طبيعية خال من الكحول و المواد الكيميائية الضارة للجسم 👌 غني بالزيت الاساسي للنعناع و زيت جوز الهند 🥥 يضمن لك حماية ضد الرطوبة و العرق مع تفتيح البشرة 🌿',NULL,NULL,0,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'[]',1,1,0,1,'2026-08-16T17:00:50.049Z','2026-09-18T20:00:46.792Z');
INSERT INTO "products" ("id","name","slug","short_description","full_description","category_id","price","price_visible","is_available","sku","volume","ingredients","benefits","usage_instructions","precautions","tags","is_featured","is_published","position","whatsapp_enabled","created_at","updated_at") VALUES('ff869fc5-b9cf-4451-bbac-59bd4ab72d21','Sérum Concentré Acide Hyaluronique','serum-concentre-acide-hyaluronique','💕🌸 أكثر منتج تحتاجه بشرتك خاصة في فصل الصيف‼️‼️ تركيبة متطورة تغلغل في بشرتك و تغذيها بعمق و تمنع ظهور التجاعيد و خاصة تمنحك إشراقة منذ الاستعمال الأول 💕👌🌸',NULL,NULL,0,1,1,NULL,NULL,'Acide Hyaluronique','💕🌸 أكثر منتج تحتاجه بشرتك خاصة في فصل الصيف‼️‼️ تركيبة متطورة تغلغل في بشرتك و تغذيها بعمق و تمنع ظهور التجاعيد و خاصة تمنحك إشراقة منذ الاستعمال الأول 💕👌🌸',replace(replace('Mode d''utilisation\r\n- Etape 1\r\n- Etape 2\r\n','\r',char(13)),'\n',char(10)),NULL,'[]',1,1,0,1,'2026-08-16T16:22:32.366Z','2026-09-18T20:01:38.678Z');
INSERT INTO "products" ("id","name","slug","short_description","full_description","category_id","price","price_visible","is_available","sku","volume","ingredients","benefits","usage_instructions","precautions","tags","is_featured","is_published","position","whatsapp_enabled","created_at","updated_at") VALUES('55417622-b906-4bd0-bd67-a876a9a3a3b2','Huile d''Amande Douce','huile-damande-douce-nrcr','Première pression à froid, pour visage, corps et cheveux.',NULL,'5b2d5bd2-d445-4e04-a4ff-88541f4652da',0,1,0,NULL,'50ml','Prunus dulcis (huile d''amande douce)','Nourrit et assouplit la peau et les cheveux.','Appliquer quelques gouttes sur peau propre, matin et/ou soir.','Usage externe uniquement.','[]',1,1,0,1,'2026-09-18T11:54:22.777Z','2026-09-18T20:01:54.785Z');
INSERT INTO "products" ("id","name","slug","short_description","full_description","category_id","price","price_visible","is_available","sku","volume","ingredients","benefits","usage_instructions","precautions","tags","is_featured","is_published","position","whatsapp_enabled","created_at","updated_at") VALUES('a25f3ee6-38ae-46f7-937c-2c0908d18571','Roll-on Anti-Âge','roll-on-anti-age-gczr','L''élixir de jeunesse : figue de barbarie, néroli et jojoba.',NULL,NULL,34.9,1,1,NULL,'10ml','Huile de figue de barbarie, huile essentielle de néroli, huile de jojoba','Régénère, raffermit et hydrate la peau.','Appliquer localement sur le contour des yeux et du visage.','Ne pas exposer au soleil juste après application.','[]',1,0,0,1,'2026-09-18T11:54:24.084Z','2026-09-19T20:43:45.094Z');
CREATE TABLE `rate_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "rate_limits" ("id","key","created_at") VALUES(1,'contact:::1','2026-09-21T11:32:56.347Z');
INSERT INTO "rate_limits" ("id","key","created_at") VALUES(2,'order:::1','2026-09-21T11:33:25.211Z');
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
INSERT INTO "site_settings" ("id","data","updated_at") VALUES(1,'{"email":"marysens933@gmail.com","phone":"+216 27 995 027","address":"Rue Andalouss, Mahdia, Tunisia, 5100","logo_url":"/images/logo.png","seo_title":"Mary''sens — Soin & bien-être naturel","brand_name":"Mary''sens","hero_image":"https://dxlvvxkygurqjrpbbbmy.supabase.co/storage/v1/object/public/marysens-media/settings/hero-1789243134500.webp","hero_title":"Mary''sens","tiktok_url":"https://www.tiktok.com/@marysens1?is_from_webapp=1&sender_device=pc","about_story":"À compléter depuis l''administration (Contenu du site > La marque).","description":"Soin et bien-être. La marque tunisienne de référence des huiles essentielles et végétales 100% pures et bio.","about_values":"À compléter depuis l''administration.","facebook_url":"https://www.facebook.com/profile.php?id=100088399909526","hero_tagline":"Soin & bien-être naturel","about_mission":"À compléter depuis l''administration.","instagram_url":"https://www.instagram.com/marysens_/","seo_description":"Huiles essentielles et végétales 100% pures et bio, pensées et fabriquées en Tunisie.","whatsapp_number":"21627995027","hero_description":"Des huiles essentielles et végétales 100% pures et bio, pensées pour prendre soin de vous, naturellement.","whatsapp_enabled":false}','2026-09-18T13:12:48.781Z');
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "account" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('admin','admin','credential','admin',NULL,NULL,NULL,NULL,NULL,NULL,'18ab111dafec0f7fa86da2d852e8e6b1:58fcab52cd733a54d9c0763f11fa09d5bc249f0031c36c10f8f78b1457878166c5b522255966180825e004599c275eebb20c61dbd2d63b75a8e9ea89283324db',1789943353000,1789943353000);
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id") VALUES('Uvt12p5Vo4VhZhXxp00Mbkt8xqCJzxjo',1790549060696,'9O4dAHKNZlyfBQ4nS89thTLQIS2arkOt',1789944260696,1789944260696,'0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Windows NT; Windows NT 10.0; fr-FR) WindowsPowerShell/5.1.26100.9444','admin');
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id") VALUES('SxxsknIMu4pgPQ60d8WoRTHAmTKnh2fJ',1790549082121,'kOyCPtaXrAabboHWrU3CTfvbP6OrXZgq',1789944282121,1789944282121,'0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Windows NT; Windows NT 10.0; fr-FR) WindowsPowerShell/5.1.26100.9444','admin');
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id") VALUES('43UOyaxNPyGZhZ3PV7KyNoVBILfaC1A4',1790549086539,'wgHthcDLvO9tgAhnDeI19y11NUymIh8g',1789944286539,1789944286539,'0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Windows NT; Windows NT 10.0; fr-FR) WindowsPowerShell/5.1.26100.9444','admin');
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id") VALUES('lFC3nvvIMWQPfkiLtcFFeSpb2RcOTr1a',1790602559817,'xdTGfbRb1Cdz4PTLFJBHli91MsQXmgEZ',1789997759817,1789997759817,'0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 OPR/135.0.0.0','admin');
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
INSERT INTO "user" ("id","name","email","email_verified","image","created_at","updated_at") VALUES('admin','Admin','oumayma0203@gmail.com',1,NULL,1789943010000,1789943010000);
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('rate_limits',2);
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);
CREATE INDEX `product_images_product_idx` ON `product_images` (`product_id`);
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
CREATE INDEX `products_category_idx` ON `products` (`category_id`);
CREATE INDEX `rate_limits_key_idx` ON `rate_limits` (`key`,`created_at`);
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
