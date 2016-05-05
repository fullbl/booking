@extends('layouts.app')

@section('scripts')
<script defer src="{{ asset('js/admin.js') }}"></script>
@endsection

@section('content')
@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
@if (session('message'))
    <div class="alert alert-success">
        {{ session('message') }}
    </div>
@endif
<div class="container" id="admin">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    <table id="rooms" class="table"></table>
                </div>
            </div>

            <div class="panel panel-default">
                <div class="panel-heading">New room</div>
                <div class="panel-body">
                    <form method="POST" action="{{ route('api.room.store') }}" role="form">
                        {{ csrf_field() }}
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" class="form-control" name="name" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="price">Price:</label>
                            <input type="text" class="form-control" name="price" id="price" required>
                        </div>
                        <div class="form-group">
                            <label for="beds">Beds:</label>
                            <input type="number" class="form-control" name="beds" id="beds" required>
                        </div>
                        <button type="submit" class="btn btn-default">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
