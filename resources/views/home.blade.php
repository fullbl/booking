@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Book your room</div>

                <div class="panel-body">
                    <h2>Rooms</h2>
                    <div id="user-rooms" class="table" data-url="{{route('api.room.index')}}">Loading rooms...</div>
                </div>
            </div>            
        </div>
    </div>
</div>
@endsection