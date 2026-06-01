-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "channelId" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "viewCount" INTEGER,
    "likeCount" INTEGER,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "transcriptFetched" BOOLEAN NOT NULL DEFAULT false,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "tickers" TEXT NOT NULL,
    "quote" TEXT,
    "importance" INTEGER NOT NULL DEFAULT 5,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsItem_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StockRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "quote" TEXT,
    "priceAtTime" REAL,
    "targetPrice" REAL,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockRecommendation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL,
    "videosFound" INTEGER NOT NULL DEFAULT 0,
    "videosAnalyzed" INTEGER NOT NULL DEFAULT 0,
    "newsExtracted" INTEGER NOT NULL DEFAULT 0,
    "stocksExtracted" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT
);

-- CreateTable
CREATE TABLE "Settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_externalId_key" ON "Video"("externalId");

-- CreateIndex
CREATE INDEX "Video_platform_publishedAt_idx" ON "Video"("platform", "publishedAt");

-- CreateIndex
CREATE INDEX "Video_analyzed_idx" ON "Video"("analyzed");

-- CreateIndex
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsItem_category_sentiment_idx" ON "NewsItem"("category", "sentiment");

-- CreateIndex
CREATE INDEX "StockRecommendation_ticker_idx" ON "StockRecommendation"("ticker");

-- CreateIndex
CREATE INDEX "StockRecommendation_publishedAt_idx" ON "StockRecommendation"("publishedAt");

-- CreateIndex
CREATE INDEX "StockRecommendation_confidence_idx" ON "StockRecommendation"("confidence");
