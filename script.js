$(document).ready(function() {
  var marks = ["X", "O"];
  var currentTurn = marks[0];
  var currentPlayer = 1;
  var AIPlayer;
  var humanPlayer;
  var gameEnded = false;
  var squaresCompleted = 0;
  var space;
  var lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function isEmpty(value) {
    if (value === "X" || value === "O") {
      return false;
    } else {
      return true;
    }
  }

  function squareEmpty(selector) {
    return isEmpty($(selector).text());
  }

  function switchTurn() {

    if (currentPlayer === 1) {
      currentPlayer = 2;
    } else {
      currentPlayer = 1;
    }

    if (currentTurn === "X") {
      currentTurn = "O";
    } else {
      currentTurn = "X";
    }
  }

  function refreshPlayerStatus() {
    $("#playerStatus").text("Player " + currentPlayer + "'s turn");
  }

  function loadOption2(numPlayers) {
    $("#board").html($("#options2").html());
    $(".xOrO").click(function(e) {
      if (e.currentTarget.id === "X" && numPlayers === 1) {
        AIPlayer = 2;
        humanPlayer = 1;
      } else if (e.currentTarget.id === "O" && numPlayers === 1) {
        AIPlayer = 1;
        humanPlayer = 2;
      }

      loadTTTBoard(numPlayers);
    });
  }

  function nextMoveAI() {
    var selectorA;
    var selectorB;
    var selectorC;
    var corner1 = 0;
    var corner2 = 2;
    var corner3 = 6;
    var corner4 = 8;
    var selectorCorner1 = "#" + corner1;
    var selectorCorner2 = "#" + corner2;
    var selectorCorner3 = "#" + corner3;
    var selectorCorner4 = "#" + corner4;
    var selectorSide1 = "#" + 1;
    var selectorSide3 = "#" + 3;
    var selectorSide5 = "#" + 5;
    var selectorSide7 = "#" + 7;

    function firstMove() {
      var firstMoves = [corner1, corner2, corner3, corner4];
      var random;

      if (squaresCompleted === 0 && AIPlayer === 1) {
        random = getRandomIntInclusive(0, 3);
        return firstMoves[random];
      } else {
        return false;
      }

      function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }

    function twoInLine(arr) {
      if ((arr[0] === arr[1]) && isEmpty(arr[2]) &&
        isEmpty(arr[1]) === false) {
        return 2;
      } else if ((arr[1] === arr[2]) && isEmpty(arr[0]) &&
        isEmpty(arr[1]) === false) {
        return 0;
      } else if ((arr[0] === arr[2]) && isEmpty(arr[1]) &&
        isEmpty(arr[0]) === false) {
        return 1;
      } else {
        return false;
      }
    }

    function oneInLineContainsAIMark(arr) {
      if (arr[0] === marks[AIPlayer - 1] || arr[1] === marks[AIPlayer - 1] ||
        arr[2] === marks[AIPlayer - 1]) {
        return true;
      } else {
        return false;
      }
    }

    function win(arrPossMoves) {
      var arrLineMarks = [];
      var wins = [];

      for (i = 0; i < lines.length; i++) {
        arrLineMarks = fillArrWithLineAndPossMoves(lines[i], arrPossMoves);

        if (twoInLine(arrLineMarks) !== false && oneInLineContainsAIMark(arrLineMarks)) {
          wins.push(lines[i][twoInLine(arrLineMarks)]);
        }
      }

      if (wins.length >= 1) {
        return wins;
      } else {
        return false;
      }

    }

    function block(arrPossMoves) {
      var arrLineMarks = [];
      var blocks = [];

      for (i = 0; i < lines.length; i++) {
        arrLineMarks = fillArrWithLineAndPossMoves(lines[i], arrPossMoves);

        if (twoInLine(arrLineMarks) !== false && oneInLineContainsAIMark(arrLineMarks) === false) {
          blocks.push(lines[i][twoInLine(arrLineMarks)]);
        }
      }

      if (blocks.length >= 1) {
        return blocks;
      } else {
        return false;
      }
    }

    function fillArrWithLineAndPossMoves(line, arrPossMoves) {
      var resultArr = [];

      selectorA = "#" + line[0];
      selectorB = "#" + line[1];
      selectorC = "#" + line[2];

      resultArr[0] = $(selectorA).text().trim();
      resultArr[1] = $(selectorB).text().trim();
      resultArr[2] = $(selectorC).text().trim();

      if (typeof arrPossMoves !== 'undefined') {
        for (var i = 0; i < arrPossMoves.length; i++) {
          if (line[0] === arrPossMoves[i][0] && resultArr[0] === $(selectorA).text().trim()) {
            resultArr[0] = arrPossMoves[i][1];
          } else if (line[1] === arrPossMoves[i][0] && resultArr[1] === $(selectorB).text().trim()) {
            resultArr[1] = arrPossMoves[i][1];
          } else if (line[2] === arrPossMoves[i][0] && resultArr[2] === $(selectorC).text().trim()) {
            resultArr[2] = arrPossMoves[i][1];
          }
        }
      }

      return resultArr;
    }

    function fork(player, arrPossMove) {
      var mark;
      var selector;
      var forks = [];

      function countElementInArr(arr, element) {
        var count = 0;
        var elementIndexes = [];

        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === element) {
            count++;
            elementIndexes.push(i);
          }
        }

        return [count, elementIndexes];
      }

      if (player === AIPlayer) {
        mark = marks[AIPlayer - 1];
        for (var m = 0; m <= 8; m++) {
          selector = "#" + m;
          if (squareEmpty(selector)) {
            if (typeof arrPossMove !== 'undefined' && win([
                [arrPossMove[0], arrPossMove[1]],
                [m, mark]
              ]).length >= 2) {
              forks.push(m);
            } else if (typeof arrPossMove === 'undefined' && win([
                [m, mark]
              ]).length >= 2) {
              forks.push(m);
            }
          }
        }
        return false;
      } else {
        mark = marks[humanPlayer - 1];
        for (var n = 0; n <= 8; n++) {
          selector = "#" + n;
          if (squareEmpty(selector)) {
            if (typeof arrPossMove !== 'undefined' && block([
                [arrPossMove[0], arrPossMove[1]],
                [n, mark]
              ]).length >= 2) {
              forks.push(n);
            } else if (typeof arrPossMove === 'undefined' && block([
                [n, mark]
              ]).length >= 2) {
              forks.push(n);
            }
          }
        }

        if (forks.length > 0) {
          return forks;
        } else {
          return false;
        }
      }
    }

    function blockFork() {
      function createTwoInRowWithoutEnablingFork() {
        var selector;
        for (var i = 0; i <= 8; i++) {
          selector = "#" + i;
          if (squareEmpty(selector) && win([
              [i, marks[AIPlayer - 1]]
            ]).length >= 1 && (fork(humanPlayer, [i, marks[AIPlayer - 1]]) === false || forkDoesNotBlockWin(fork(humanPlayer, [i, marks[AIPlayer - 1]]), win([
              [i, marks[AIPlayer - 1]]
            ])[0]))) {
            return i;
          }
        }
        return false;
      }

      function forkDoesNotBlockWin(forks, win) {

        for (var j = 0; j < forks.length; j++) {
          if (forks[j] === win) {
            return false;
          }
        }
        return true;
      }

      if (createTwoInRowWithoutEnablingFork() !== false) {
        return createTwoInRowWithoutEnablingFork();
      } else if (fork(humanPlayer) === false) {
        return false;
      } else {
        return fork(humanPlayer)[0];
      }
    }

    function markCenter() {
      var center = 4;
      var selectorCenter = "#" + center;

      if (squareEmpty(selectorCenter)) {
        return center;
      } else {
        return false;
      }
    }

    function markOppositeCorner() {
      if (squareEmpty(selectorCorner1) && $(selectorCorner4).text() === marks[humanPlayer - 1]) {
        return 0;
      } else if (squareEmpty(selectorCorner4) && $(selectorCorner1).text() === marks[humanPlayer - 1]) {
        return 8;
      } else if (squareEmpty(selectorCorner2) && $(selectorCorner3).text() === marks[humanPlayer - 1]) {
        return 2;
      } else if (squareEmpty(selectorCorner3) && $(selectorCorner2).text() === marks[humanPlayer - 1]) {
        return 6;
      } else {
        return false;
      }
    }

    function markEmptyCorner() {
      if (squareEmpty(selectorCorner1)) {
        return 0;
      } else if (squareEmpty(selectorCorner2)) {
        return 2;
      } else if (squareEmpty(selectorCorner3)) {
        return 6;
      } else if (squareEmpty(selectorCorner4)) {
        return 8;
      } else {
        return false;
      }
    }

    function markEmptySide() {
      if (squareEmpty(selectorSide1)) {
        return 1;
      } else if (squareEmpty(selectorSide3)) {
        return 3;
      } else if (squareEmpty(selectorSide5)) {
        return 5;
      } else if (squareEmpty(selectorSide7)) {
        return 7;
      } else {
        return false;
      }
    }

    if (firstMove() !== false) {
      return firstMove();
    } else if (win() !== false) {
      return win()[0];
    } else if (block() !== false) {
      return block();
    } else if (fork(AIPlayer) !== false) {
      return fork(AIPlayer)[0];
    } else if (blockFork() !== false) {
      return blockFork();
    } else if (markCenter() !== false) {
      return markCenter();
    } else if (markOppositeCorner() !== false) {
      return markOppositeCorner();
    } else if (markEmptyCorner() !== false) {
      return markEmptyCorner();
    } else if (markEmptySide() !== false) {
      return markEmptySide();
    } else {
      return false;
    }
  }

  function loadTTTBoard(numPlayers) {

    $("#board").html($("#ttt-board").html());
    clearBoard();

    window.setTimeout(function() {
      if (AIPlayer === 1) {
        markSquare(nextMoveAI());
      }
    }, 350);

    $("ul li").click(function(e) {
      if ((numPlayers === 1 && humanPlayer === currentPlayer) || (numPlayers === 2)) {
        markSquare(e.currentTarget.id);

        if (numPlayers === 1 && AIPlayer === currentPlayer && nextMoveAI() !== false) {
          window.setTimeout(function() {
            markSquare(nextMoveAI());
          }, 350);
        }
      }
    });

    function clearBoard() {
      $("#0").text(" ");
      $("#1").html("\&nbsp\;");
      $("#2").html("\&nbsp\;");
      $("#3").html("\&nbsp\;");
      $("#4").html("\&nbsp\;");
      $("#5").html("\&nbsp\;");
      $("#6").html("\&nbsp\;");
      $("#7").html("\&nbsp\;");
      $("#8").html("\&nbsp\;");
    }

    function resetGame() {
      gameEnded = false;
      currentTurn = "X";
      currentPlayer = 1;
      squaresCompleted = 0;

      clearBoard();

      refreshPlayerStatus();

      if (AIPlayer === 1) {
        window.setTimeout(function() {
          markSquare(nextMoveAI());
        }, 2200);
      }
    }

    function markSquare(square) {
      var selector = "#" + square;

      if ($(selector).text() !== "O" && $(selector).text() !== "X" && gameEnded !== true) {
        $(selector).text(currentTurn);
        squaresCompleted++;
        if (win()) {
          window.setTimeout(afterWin, 500);
        } else if (squaresCompleted === 9) {
          window.setTimeout(afterDraw, 500);
        } else {
          switchTurn();
          refreshPlayerStatus();
        }
      }

      function win() {
        function threeInRow(arr) {
          var selectorA = "#" + arr[0];
          var selectorB = "#" + arr[1];
          var selectorC = "#" + arr[2];

          if (($(selectorA).text() === $(selectorB).text() && $(selectorB).text() === $(selectorC).text()) &&
            squareEmpty(selectorA) === false) {
            return true;
          } else {
            return false;
          }
        }

        for (i = 0; i < lines.length; i++) {
          if (threeInRow(lines[i])) {
            return true;
          }
        }

        return false;
      }
    }

    function afterWin() {
      gameEnded = true;

      if (AIPlayer === currentPlayer) {
        displayStatus("Oh no, you lost! Try again!");
      } else {
        displayStatus("Player " + currentPlayer + " wins!!");
      }

      resetGame();
    }

    function afterDraw() {
      gameEnded = true;
      displayStatus("Draw!");
      resetGame();
    }

    function displayStatus(message) {
      $("#status").text(message);
      $("#board").addClass("statusDisplayed");
      $("#status").fadeIn("slow", function() {
        $("#status").show();
      });
      window.setTimeout(function() {
        $("#status").fadeOut("slow", function() {});
        $("#board").removeClass("statusDisplayed");
      }, 1500);
    }

    refreshPlayerStatus();
  }

  $("#board").html($("#options1").html());
  $("#onePlayer").click(function() {
    loadOption2(1);
  });

  $("#twoPlayers").click(function() {
    loadOption2(2);
  });

});