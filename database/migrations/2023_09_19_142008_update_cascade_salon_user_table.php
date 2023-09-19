<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCascadeSalonUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('salon_user', function (Blueprint $table) {
            $table->dropForeign('salon_user_salon_id_foreign');
            $table->foreign('salon_id')->references('id')->on('salons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('salon_user', function (Blueprint $table) {
            $table->dropForeign('salon_user_salon_id_foreign');
            $table->foreign('salon_id')->references('id')->on('salons');
        });
    }
}
