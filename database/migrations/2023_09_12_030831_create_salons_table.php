<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salons', function (Blueprint $table) {
            $table->id();
            $table->string('owner_email', 255)->unique();
            $table->string('name', 255);
            $table->string('address', 255);
            $table->string('registration_package', 255);
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            $table->foreign('owner_email')->references('email')->on('registrations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('salons');
    }
}
