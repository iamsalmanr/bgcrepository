<?php

namespace App\Console\Commands;

use App\Services\GolfNewsService;
use Illuminate\Console\Command;

class SyncGolfNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically fetch and synchronize the latest Bangladesh golf news from online feeds (Google News BD, The Golf House, etc.)';

    /**
     * Execute the console command.
     */
    public function handle(GolfNewsService $newsService): int
    {
        $this->info('Starting Bangladesh golf news sync...');

        $result = $newsService->syncNews();

        $this->info("Sync completed successfully!");
        $this->line("Total items processed: {$result['total_synced']}");
        $this->line("Total articles in database: {$result['total_in_db']}");

        return Command::SUCCESS;
    }
}
