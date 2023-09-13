<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('salon_name', 255);
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255)->unique();
            $table->string('phone', 15);
            $table->string('password');
            $table->string('address');
            $table->integer('staffs_number', false, true);
            $table->integer('seats_number', false, true);
            $table->string('registration_package', 255);
            $table->tinyInteger('status')->default(0);
            $table->timestamp('approved_at')->nullable();
            $table->integer('approved_by', false, true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('registrations');
    }
}
