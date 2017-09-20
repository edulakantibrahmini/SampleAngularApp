'use strict';

angular.module('myApp.view2', []) .controller('View2Ctrl', ['$filter', '$scope', 'viewFactory', 'viewConstants', function($filter, $scope,
                                                                                     viewFactory, viewConstants) {
                                                                
  $scope.processList = [];
  $scope.userInput = "";
    var decimalProcess = "";
  
  /** 
   * This function used to trigger on init of the page to 
   * fetch the details by invoking http service, if data found 
   * then invoke private function to process json.
   */
    $scope.processList = function () {
        viewFactory.fetchDetailList().then(function(responseData){
            if (responseData.data.length > 0) {
                // bind to scope.
               $scope.processList = _processJsonList(responseData.data);
            }
        });
    }
    
    /**
     * This function used to process the response json grouping by name.
     **/
    function _processJsonList (dataList) {
        var filterData = {};
        var processData = [];
        var test = dataList;
        angular.forEach(dataList,function(value, index){
            var filterObject = {};
            // verify the same name is existing in the object.
            var existingValue = $filter('filter')(processData, {name: dataList[index].name});
            if (existingValue.length === 0){
                filterObject = $filter('filter')(test, {name: dataList[index].name});    
                filterData = {};
                filterData.name = dataList[index].name;
                filterData.amountC1 = "-";
                filterData.amountC2 = "-";
                filterData.amountC3 = "-";
                for (var i=0; i<filterObject.length;i++) {
                    if(filterObject[i].category == "C1") {
                        filterData.amountC1 = filterObject[i].amount;
                    } else if(filterObject[i].category == "C2") {
                        filterData.amountC2 = filterObject[i].amount;
                    } else if(filterObject[i].category == "C3") {
                        filterData.amountC3 = filterObject[i].amount;
                    }
                }        
                // push into array
                processData.push(filterData);
            }
        });
        return $filter('orderBy')(processData, 'name');
    }
	
	
	
	/** CHECK Writer **/
	$scope.processOutput = function () {
	  // find the length of the input.
	  if ($scope.userInput) {
		  var userInput = $scope.userInput;
		  var inputIntegerData = userInput.split(".");
		  if (inputIntegerData[0].length == 2 ) {
              decimalProcess = inputIntegerData;
			_processTwoDigitCheck(inputIntegerData);
		  } else if (inputIntegerData[0].length == 3) {
			 _processThreeDigitCheck(inputIntegerData);
		  }
	  }
	}
	
	/** This function is used to convert Nbr
	 * into Alphabets if user entered two digits.
	 * @param {number} inputIntegerData
	 **/
	 function _processThreeDigitCheck (inputIntegerData) {
		var result = "";
		var partialValue1 = "";
		var partialValue2 = "";
		var partialValue3 = "";
		var inputList = inputIntegerData[0].split("");
		for (var i=0; i<inputList.length;i++){
			if (i == 0) {
			  partialValue1 = _convertPositionIntoAlpha(inputList[i]) + " " + viewConstants.HUNDRED;
			} else if (i == 1 && inputList[i] != 0) {
			  var data = _convertPositionIntoAlpha(inputList[i]);
			  partialValue2 = _processIntoAlpha(data);
			} else if (inputList[i] != 0){
			  partialValue3 = _convertPositionIntoAlpha(inputList[i]);
			}		
		}
		// format o/p
		if(angular.isDefined(inputIntegerData[1])) {
		   $scope.outputData = partialValue1 + " " + partialValue2 + " " + partialValue3 + " " + "and" + " " + inputIntegerData[1] + "/" + viewConstants.INTEGER_HUNDRED;
		} else {
		   $scope.outputData = partialValue1 + " " + partialValue2 + " " + partialValue3 + " " + viewConstants.ONLY;	
		}
		
	}
	
	/** This function is used to convert Nbr
	 * into Alphabets if user entered two digits.
	 * @param {number} inputIntegerData
	 **/
	 function _processTwoDigitCheck (inputIntegerData) {
		var result = "";
		var partialValue1 = "";
		var partialValue2 = "";
		var inputList = inputIntegerData[0].split("");
		for (var i=0; i<inputList.length;i++){
			if (i==0) {
			  partialValue1 = _convertPositionIntoAlpha(inputList[i]);
			} else {
			  partialValue2 = _convertPositionIntoAlpha(inputList[i]);
			}		
		}
		// format o/p
		_formatOutput(partialValue1, partialValue2);
	}
	
	/** This function is used to find the exact match value 
	 * and return back to the value.
	 * @param {number} data
	 **/
	function _convertPositionIntoAlpha (data) {
		var value = "";
		switch (data) {
			case '1' :
			case 'ONE' :
			   value = viewConstants.ONE;
			   break;
			 case '2' :
			 case 'TWO':
			   value = viewConstants.TWO;
			   break;
			 case '3' :
			 case 'THREE':
			   value = viewConstants.THREE;
			   break;
			 case '4' :
			 case 'FOUR':
			   value = viewConstants.FOUR;
			   break;
			 case '5' :
			 case 'FIVE':
			   value = viewConstants.FIVE;
			   break;
			 case '6' :
			 case 'SIX':
			   value = viewConstants.SIX;
			   break;
			 case '7' :
			 case 'SEVEN':
			   value = viewConstants.SEVEN;
			   break;
			 case '8' :
			 case 'EIGHT':
			   value = viewConstants.EIGHT;
			   break;
			 case '9' :
			 case 'NINE':
			   value = viewConstants.NINE;
			   break;
			 default :
			   value = viewConstants.ZERO;
			   break;
		}
		return value;
	}
	
	/** This function is used manipulate the input values convert into Alphabets.
	 * @param {number} input1
	 * @param {number} input2
	 **/
	function _formatOutput (input1,input2) {
		var value = "";
		var partialValue1 = "";
		var partialValue2 = "";

		if (input2 == viewConstants.ZERO) {
			value = _processIntoAlpha(input1, input2);
		} else if (input2 != viewConstants.ZERO) {
			partialValue1 = _processIntoAlpha(input1);
			partialValue2 = _convertPositionIntoAlpha(input2);
		}
		/*$scope.outputData = partialValue1 + " " + partialValue2 + " " + viewConstants.ONLY;*/
        if(angular.isDefined(decimalProcess[1])) {
            $scope.outputData = partialValue1 + " " + partialValue2 + " "  + " " + "and" + " " + decimalProcess[1] + "/" + viewConstants.INTEGER_HUNDRED;

        } else {
            $scope.outputData = partialValue1 + " " + partialValue2 + " " + viewConstants.ONLY;
        }
	}
	
	/** This function is used manipulate the input values convert into Alphabets.
	 * @param {number} input1
	 * @param {number} input2
	 **/
	function _processIntoAlpha (input1, input2) {
		var value = "";
		if(input1 == viewConstants.TWO) {
			value = "TWENTY";
		} else if (input1 == viewConstants.THREE) {
			value = "THIRTHY"
		} else if (input1 != viewConstants.ONE && input1 != viewConstants.TWO && input1 != viewConstants.THREE){
			if (input1!= viewConstants.EIGHT && input1!= viewConstants.SIX) {
			  value = input1 + "TY";	
			} else if (input1 == viewConstants.SIX){
				value = input1 + "ITY";
			} else {
				value = input1 + "Y";
			}	
		} else if (input1 == viewConstants.ONE && input2 == viewConstants.ZERO) {
			value = "TEN";
		}
		return value;
	}
	/** CHECK Writer **/
}]);