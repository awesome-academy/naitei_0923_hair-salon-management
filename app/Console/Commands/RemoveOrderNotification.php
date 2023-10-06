<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RemoveOrderNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove:OrderNotifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove order notifications daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        DB::table('notifications')
            ->whereDate('created_at', '<=', now()->subDays(1))
            ->where('type', '=', get_class(new OrderNotification(new Order(), new User(), '', '')))
            ->delete();
    }
}
