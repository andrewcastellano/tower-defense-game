<!DOCTYPE html>
<html>
<head>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet">
    <!-- Bootstrap -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <!-- Custom Style -->
    <link href="/css/style.css" rel="stylesheet" type="text/css">
</head>
<body class="position-relative high-scores">
    <div class="panel-image" style="background:url('/images/robot.png');background-position:50% 50%;background-repeat: no-repeat"></div>
    <div class="container pt-5">
        <div class="row pt-5">
            <div class="col text-center pt-4">
                <h1>Ai Uprising</h1>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row justify-content-between align-items-center">
            <div class="col-4">
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{name}}</td>
                        <td>{{score}}</td>
                    </tr>
                    <tr>
                        <td>{{name}}</td>
                        <td>{{score}}</td>
                    </tr>
                    <tr>
                        <td>{{name}}</td>
                        <td>{{score}}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div class="col-4 text-right">
                <a href="#" class="btn btn-primary my-3 w-100">Cancel</a>
            </div>
        </div>
    </div>

</body>
</html>