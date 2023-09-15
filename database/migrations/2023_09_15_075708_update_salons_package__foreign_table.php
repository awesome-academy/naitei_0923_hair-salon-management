<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSalonsPackageForeignTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('salons', function (Blueprint $table) {
            $table->dropColumn('registration_package');
            $table->foreignId('package_id')->constrained('packages');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('salons', function (Blueprint $table) {
            $table->string('registration_package');
            $table->dropForeign(['package_id']);
        });
    }
}
