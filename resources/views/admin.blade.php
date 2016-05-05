@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    Loading dashboard
                </div>
            </div>

            <div class="panel panel-default">
                <div class="panel-heading">New room</div>
                <div class="panel-body">
                    <form method="POST" method="{{route('api.room.create')" role="form">
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" class="form-control" id="name">
                        </div>
                        <div class="form-group">
                            <label for="beds">Beds:</label>
                            <input type="number" class="form-control" id="beds">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
