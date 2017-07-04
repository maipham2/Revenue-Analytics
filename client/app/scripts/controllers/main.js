'use strict';
const errorMsg = "Error getting data";

app.controller('chartController', function($scope, $http) {
    $scope.showError = false;

    /***** Select Element *****/
    //Get distinct years from database to add to the Select element
    $http.get('http://localhost:3001/years').
    then(
        function(response) {
            if (response.data != errorMsg) {
                $scope.showError = false; //Hide the error elert element
                $scope.years = response.data;
                response.data.push("All");          
            } else {
                $scope.showError = true;
            }
        }
    );
    $scope.selectedYear = "All"; //No filter by default
    //Click event for select element
    $scope.update = function() {
        var url = ($scope.selectedYear == "All") ? 'http://localhost:3001/sales' : 'http://localhost:3001/sales?year=' + $scope.selectedYear;
        loadDataForPieChart(url, $scope, $http);
    };

    /***** Pie Chart *****/
    //Get all data by defaults, no filter
    $scope.chartOptions = {
        legend: {
            display: true,
            position: "bottom"
        },
        title: {
            display: true,
            position: "top",
            fontSize: 18,
            text: "Revenue By Product, All",
            fontStyle: "bold"
        },
        layout: {
            padding: {
                left: 50,
                right: 0,
                bottom: 0
            }
        },
        tooltips: {  
            callbacks: {
                label: function(tooltipItem, data) {
                    var legend = new Array();
                    for(var i in data.datasets){
                        legend.push(formatMoney(data.datasets[i].data[tooltipItem.index])); //Format number in tooltip
                    }
                    return legend;
                }
            }
         }
    };
    loadDataForPieChart('http://localhost:3001/sales', $scope, $http)

    //Click event for slices in pie chart
    $scope.onClickSlice = function(points, evt) {
        $scope.$apply(function() {
            if (points[0] != undefined) {
                var selectedProduct = points[0]._model.label;
                // Prepare data for the revenue table
                $scope.dataGridTitle = "Revenue Report, " + $scope.selectedYear + ', ' + selectedProduct;
                $scope.gridLabels = ['Fiscal Year', 'Product', 'Region', 'Revenue'];
                $scope.gridData = prepareDataForGrid($scope.data, selectedProduct, $scope.selectedYear);
                $scope.showDataGrid = true;

            }

        });
    };
});

/**
This function get data by calling a restful API and prepares data for piechart
@param: url API url
@param $scope
@param $http
@return none
*/
function loadDataForPieChart(url, $scope, $http) {
    $http.get(url).then(
        function(response) {
            if (response.data != errorMsg) {
                $scope.showError= false;
                $scope.data = response.data;
                $scope.chartOptions.title.text = "Revenue By Product, " + $scope.selectedYear;
                var map = groupByProduct($scope.data);
                $scope.chartLabels = Object.keys(map);
                $scope.chartData = Object.keys(map).map(function(key) {
                    return map[key];
                });
                $scope.showDataGrid = false;
            } else {
                $scope.showError= true;
            }
            
        }
    );
}

/**
This method groups data by product and returns a map where keys are product name 
and values are total revenue of that product
@param: data Data to be grouped
@return: a map where keys are product name and values are total revenue for a particular product
*/
function groupByProduct(data) {
    var map = {};
    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        if (map[entry.product] == null) {
            map[entry.product] = entry.revenue ? entry.revenue : 0;
        } else {
            map[entry.product] = map[entry.product] + entry.revenue
        }
    }
    return map;
}

/**This function filter a set of data by year
@param: data Data to be filtered
@param: filter Can be "All" or year
@return An array with filtered by year data
*/
function filterDataByYear(data, year) {
        if (year == "All") return data;
        else {
            var filtedData = data.filter(function(entry) {
                return entry.year == year;
            });
            return filtedData;
        }
    }

/** This method prepares data for the revenue table (data grid)
@param data Data to be put in the grid
@param productName Name of product to be reported
@param year fiscal year to be reported, if no specific year is selected from the Select element, show "All"
@Return a 2 dimentional array of data to be put in the table
 */
function prepareDataForGrid(data, productName, year) {
    var gridData = [];
    var map = {}

    var filtedData = data.filter(function(entry) {
        return entry.product == productName;
    });

    //Count total revenue by country
    for (var i = 0; i < filtedData.length; i++) {
        var entry = filtedData[i];
        if (map[entry.country] == null) {
            map[entry.country] = entry.revenue ? entry.revenue : 0;
        } else {
            map[entry.country] = map[entry.country] + entry.revenue
        }
    }

    //Prepare value for data grid
    Object.keys(map).forEach(function(key) {
        var row = [];
        row.push(year);
        row.push(productName);
        row.push(key);
        row.push(formatMoney(map[key]))
        gridData.push(row);
    });

    return gridData;
}

/**
This function formats larg number to readable money format, for example 12,000,000 will be formated $12M
@param: number Number to be formated
@return: formated number 
*/
function formatMoney(number) {
    if (number < 1000) {
        return '$' + number;
    }

    if (number >= 1000 && number <= 1e+6) {
        return '$' + Math.round(number / 1000) + 'k';
    }

    if (number >= 1e+6 && number <= 1e+9) {
        return '$' + Math.round(number / 1e+6) + 'M';
    }

    if (number >= 1e+9 && number <= 1e+12) {
        return '$' + Math.round(number / 1e+9) + 'B';
    } else {
        return Math.round(number / 1e+12) + 'T';
    }
}