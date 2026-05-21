/* =============== Khởi tạo - Constructor =============== */

var player = 1; // Kiểm tra hiện đến lượt ai - Check turn

// Khai báo biến canvas để vẽ
var canvas = document.getElementById("background");
// The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
// Phương thức getContext() trả về định nghĩa để vẽ trên canvas, hoặc null nếu định nghĩa đó không được hỗ trợ
var context = canvas.getContext('2d');

// Kích thước bàn cờ - Board size
var canvasSize = 750; // Kích thước tối đa của bàn cờ - max size of board
var numberOfSquare = 10; // Số ô - number of square
var sectionSize = 70; // Kích thước mỗi ô - size of square
canvas.width = canvasSize; // Chiều dài bàn cờ - Width of board
canvas.height = canvasSize; // Chiều rộng bàn cờ - Height of board

// Số quân để thắng - number of pieces to win
var numberOfPiecesToWin = 5;

// Màu sắc - Color of X and O
var colorX = '#0000FF';
var colorO = '#FF0000';

// Cắm cờ kiểm tra thắng chưa. Thắng rồi thì thôi không chơi nữa
// Flag to check win or not. winFlag = true, game is stopped
var winFlag = false;

/* ===================== Draw ===================== */

/**
 * Vẽ bàn cờ - Draw a board
 * Chiều dọc chiều ngang có số ô bằng với numberOfSquare. Tối đa là 14x14, tối thiểu là 5x5
 * Width and Height have max number of Square is 14x14, min is 5x5
 */
function drawBoard(numberOfSquare)
{
    if (numberOfSquare <= 14)
    {
        for(x=0;x<=numberOfSquare;x++)
        {
            for(y=0;y<=numberOfSquare;y++)
            {
                // Đường ngang - rows
                context.moveTo(0,sectionSize*y);
                context.lineTo(sectionSize*numberOfSquare,sectionSize*y);
                context.stroke();

                // Đường dọc - columns
                context.moveTo(sectionSize*x,0);
                context.lineTo(sectionSize*x,sectionSize*numberOfSquare);
                context.stroke();
            }
        }
    }
    else
    {
        alert ("Max number of square is 14 - Số ô tối đa là 14");
    }
}

// Maximum is 14
drawBoard(numberOfSquare);

/**
 * Vẽ dấu O và X
 * xCordinate, yCordinate là vị trí click vào màn hình
 */
function drawO(xCordinate, yCordinate)
{
    context.beginPath();
    // arc(centerX, centerY, radius, startAngle, endAngle);
    context.arc(xCordinate,yCordinate,25,0,2*Math.PI);
    context.moveTo(xCordinate, yCordinate);
    context.arc(xCordinate, yCordinate, 1, 0, Math.PI * 2, true);
    context.lineWidth=3;
    context.strokeStyle = colorO;
    context.stroke();
}

function drawX(xCordinate, yCordinate)
{
    context.beginPath();

    context.moveTo(xCordinate - 20, yCordinate - 20);
    context.lineTo(xCordinate + 20, yCordinate + 20);

    context.moveTo(xCordinate + 20, yCordinate - 20);
    context.lineTo(xCordinate - 20, yCordinate + 20);
    context.lineWidth = 5;
    context.strokeStyle = colorX;
    context.stroke();
}

function drawOwin(xCordinate, yCordinate)
{
    context.beginPath();
    // arc(centerX, centerY, radius, startAngle, endAngle);
    context.fillRect(xCordinate - (sectionSize / 2), yCordinate - (sectionSize / 2), sectionSize, sectionSize);
    context.arc(xCordinate,yCordinate,25,0,2*Math.PI);
    context.moveTo(xCordinate, yCordinate);
    context.arc(xCordinate, yCordinate, 1, 0, Math.PI * 2, true);
    context.lineWidth=2;
    context.strokeStyle = "#FFF";
    context.stroke();
}

function drawXwin(xCordinate, yCordinate)
{
    context.beginPath();
    context.fillRect(xCordinate - (sectionSize / 2), yCordinate - (sectionSize / 2), sectionSize, sectionSize);

    context.moveTo(xCordinate - 20, yCordinate - 20);
    context.lineTo(xCordinate + 20, yCordinate + 20);

    context.moveTo(xCordinate + 20, yCordinate - 20);
    context.lineTo(xCordinate - 20, yCordinate + 20);
    context.lineWidth=5;
    context.strokeStyle = "#FFF";
    context.stroke();
}

/* ===================== Check Position ===================== */

// Step 1: event click and get position

document.getElementById("background").addEventListener("click", getPositionClick);

// https://www.w3schools.com/jsref/met_element_addeventlistener.asp

function getPositionClick(event){

    // Return the size of an element and its position relative to the viewport.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var rect = canvas.getBoundingClientRect(); 

    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    console.log(x,y);
    
    addPlayingPiece(x,y); 
}

// Step 2: draw the pieces X O on position
// After click, draw the pieces X O on position

function addPlayingPiece(clickX,clickY)
{
    if (winFlag == false)
    {
        var xCordinate, yCordinate;

        // Vòng lặp kiểm tra từng ô
        for (var x = 0;x < numberOfSquare;x++)
        {
            for (var y = 0;y < numberOfSquare;y++)
            {
                // Xác định tọa độ từng ô
                xCordinate = x * sectionSize;
                yCordinate = y * sectionSize;

                // Nếu click đúng vào vị trí của ô đó thì vẽ X hoặc O
                if (clickX > xCordinate && clickX < xCordinate + sectionSize &&
                    clickY > yCordinate && clickY < yCordinate + sectionSize)
                {
                    // Tính toán vị trí cho đúng tâm ô vuông để vẽ
                    xCordinate = xCordinate + (sectionSize / 2);
                    yCordinate = yCordinate + (sectionSize / 2);

                    // Kiểm tra vị trí xCordinate, yCordinate có màu gì khác ngoài màu trắng.
                    // Dùng console.log(pixelData); để xem mảng xuất ra
                    var pixelData = context.getImageData(xCordinate, yCordinate, 1, 1).data;

                    // Nếu mảng xuất ra là [0,0,0,0] nghĩa là chỗ đó là màu trắng
                    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0))
                    {
                        if (player % 2 == 1)
                        {
                            drawX(xCordinate,yCordinate);
                            player++;
                            checkWinRow(xCordinate,yCordinate,colorX);
                            checkWinColumn(xCordinate,yCordinate,colorX);
                            checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorX);
                            checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorX);
                        }
                        else
                        {
                            drawO(xCordinate,yCordinate);
                            player++;
                            checkWinRow(xCordinate,yCordinate,colorO);
                            checkWinColumn(xCordinate,yCordinate,colorO);
                            checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorO);
                            checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorO);
                        }
                    }
                }
            }
        }
    }
    else
    {
        alert("Win! Game finished! Thắng rồi, không chơi nữa");
    }
}

/* ===================== Check Win ===================== */

/**
 * Check win được cho vào đúng ô vừa click xong
 * Hàm này sẽ kiểm tra tất cả trường hợp thắng bắt đầu từ ô vừa click.
 * Kiểm tra bằng cách xét màu sắc.
 * After player click and draw X/O, check row 
 */
function checkWinRow(xCordinate,yCordinate,colorPiece)
{
    // Biến xác định vị trí các ô xung quanh
	// Position of other square around square was clicked
    var x;
    // Tạo mảng chứa tọa độ các ô
    var checkArray = [];

    /**
     * Hướng làm:
     * Xét bên trái, mỗi ô cùng màu cho n += 1 Xét bên phải cũng vậy.
     * Nếu số lượng phần tử >= 4 là thắng. (4 + ô vừa click = 5)
     * Nếu không, cho n = 0 rồi xét hàng dọc, hàng chéo tương tự
     * Check left and right, if the left square have same color -> n += 1 
     * If sum of square in left and right have same color >= 4 -> win (4 square + 1 square has just click)
	 * If not, n=0 and check row, diagonal
     */

    // Dựa vào màu để biết hàm này đang kiểm tra cho quân X hay O - Is this functions checking for X or O?
    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô bên trái ô vừa click. (thêm ô vừa click là 5)
		// Check 4 square on left
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            // Kiểm tra màu - check color
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
			// If array is [0,0,255,255], this is X blue
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        x = 0;

        // Kiểm tra 4 ô bên phải ô vừa click
		// Check 4 square on right
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            // Kiểm tra màu - check color
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
			// If array is [0,0,255,255], this is X blue
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        // Số quân trong mảng - size of array > numberOfPieces is win
        if (checkArray.length + 1 >= numberOfPiecesToWin)
        {
            // Kiểm tra các phần tử có liên tiếp không - Check elements of array are consecutive
            // Đầu tiên là sắp xếp mảng - array sort: from min to max 
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            // Nếu phần tử nhỏ - phần tử lớn = sectionSize thì các quân liên tiếp nhau
            // Nếu click vào giữa 1 dòng XXXX X, phải kiểm tra 2 ô sát bên trái và phải
			
			// Case 1: If checkArray[i+1] - checkArray[i] = sectionSize => 2 pieces are consecutive
			// Case 2: If player click on between rows XXXX X
            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - xCordinate == sectionSize) && (checkArray[i] + sectionSize == xCordinate)))
                {
                    right += 1;
                }
            }

            // Mảng có 4 phần tử + ô vừa click là 5, nghĩa là 4 lần so sánh.
            // Nếu so sánh cả 4 lần đều đúng, nghĩa là 5 phần tử liên tiếp
			
			// Array have 4 elements -> 4 times to check
			// 4 times to check + 1 square which player click = 5 elements are consecutive
            if (right >= checkArray.length -1)
            {
                // Ô vừa click - 1 square which player click 
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawXwin(checkArray[i],yCordinate);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô bên trái ô vừa click. (thêm ô vừa click là 5)
		// Check 4 square on left
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            // Kiểm tra màu - check color
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
			// If array is [255,0,0,255], this is O red
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        x = 0;

        // Kiểm tra 4 ô bên phải ô vừa click
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            // Kiểm tra màu - check color
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
			// If array is [255,0,0,255], this is O red
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        // Số quân trong mảng - size of array > numberOfPieces is win
        if (checkArray.length + 1 >= numberOfPiecesToWin)
        {
            // Kiểm tra các phần tử có liên tiếp không - Check elements of array are consecutive
            // Đầu tiên là sắp xếp mảng - array sort: from min to max 
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                        //console.log(max);
                    }
                }
            }

            var right = 0;

            // Nếu phần tử nhỏ - phần tử lớn = sectionSize thì các quân liên tiếp nhau
            // Nếu click vào giữa 1 dòng XXXX X, phải kiểm tra 2 ô sát bên trái và phải
			
			// Case 1: If checkArray[i+1] - checkArray[i] = sectionSize => 2 pieces are consecutive
			// Case 2: If player click on between rows XXXX X
            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - xCordinate == sectionSize) && (checkArray[i] + sectionSize == xCordinate)))
                {
                    right += 1;
                }
            }

            // Mảng có 4 phần tử + ô vừa click là 5, nghĩa là 4 lần so sánh.
            // Nếu so sánh cả 4 lần đều đúng, nghĩa là 5 phần tử liên tiếp
			
			// Array have 4 elements -> 4 times to check
			// 4 times to check + 1 square which player click = 5 elements are consecutive
            if (right == checkArray.length - 1)
            {
                // Ô vừa click - 1 square which player click 
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawOwin(checkArray[i],yCordinate);
                }
                winFlag = true;
            }
        }
    }
}

function checkWinColumn(xCordinate,yCordinate,colorPiece)
{
    var y;
    var checkArray = [];

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô phía trên ô vừa click. (thêm ô vừa click là 5)
		// Check 4 square on top
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô phía dưới ô vừa click
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPiecesToWin)
        {
            // Kiểm tra các phần tử có liên tiếp không - Check elements of array are consecutive
            // Đầu tiên là sắp xếp mảng - array sort: from min to max 
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - yCordinate == sectionSize) && (checkArray[i] + sectionSize == yCordinate)))
                {
                    right += 1;
                }
            }

            if (right >= checkArray.length - 1)
            {
                // Ô vừa click - 1 square which player click 
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawXwin(xCordinate,checkArray[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô phía trên ô vừa click.
		// Check 4 square on top
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô phía dưới ô vừa click
		// Check 4 square on bottom
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPiecesToWin)
        {
            // Kiểm tra các phần tử có liên tiếp không - Check elements of array are consecutive
            // Đầu tiên là sắp xếp mảng - array sort: from min to max 
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - yCordinate == sectionSize) && (checkArray[i] + sectionSize == yCordinate)))
                {
                    right += 1;
                }
            }

            if (right >= checkArray.length - 1)
            {
                // Ô vừa click - 1 square which player click 
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawOwin(xCordinate,checkArray[i]);
                }
                winFlag = true;
            }
        }
    }
}

/*
* Chéo từ trái qua phải là x y cùng giảm hoặc cùng tăng
* Diagonal Left To Right
*/
function checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorPiece)
{
    var x,y;
    var checkArrayX = []; // Array for X
    var checkArrayY = []; // Array for Y
    var n = 1;

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click. (thêm ô vừa click là 5)
		// Check 4 square on top left
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
		// Check 4 square on bottom right
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPiecesToWin)
        {
            // Sắp xếp mảng X tăng dần
			// Sort array X increase
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            max = 0;
            // Sắp xếp mảng Y tăng dần
			// Sort array Y increase
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] < checkArrayY[j-1])
                    {
                        max = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = max;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp - Check elements of array X are consecutive
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp - Check elements of array Y are consecutive
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i+1] - checkArrayY[i] == sectionSize) ||
                ((checkArrayY[i+1] - yCordinate == sectionSize) && (checkArrayY[i] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click - 1 square which player click 
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawXwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click.
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPiecesToWin)
        {
            // Sắp xếp mảng X tăng dần
			// Sort array X increase
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            max = 0;
            // Sắp xếp mảng Y tăng dần
			// Sort array Y increase
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] < checkArrayY[j-1])
                    {
                        max = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = max;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp - Check elements of array X are consecutive
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp - Check elements of array Y are consecutive
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i+1] - checkArrayY[i] == sectionSize) ||
                ((checkArrayY[i+1] - yCordinate == sectionSize) && (checkArrayY[i] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                winFlag = true;
                // Ô vừa click - 1 square which player click 
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawOwin(checkArrayX[i],checkArrayY[i]);
                }
            }
        }
    }
}

/*
* Chéo từ phải qua trái là x tăng y giảm hoặc ngược lại
* Diagonal Right To Left
*/
function checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorPiece)
{
    var x,y;
    var checkArrayX = [];
    var checkArrayY = [];
    var n = 1;

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPiecesToWin)
        {
            // Sắp xếp mảng X tăng dần
			// Sort array X increase
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            // Sắp xếp mảng Y giảm dần
			// Sort array Y decrease
            var min;
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] > checkArrayY[j-1])
                    {
                        min = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = min;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp - Check elements of array X are consecutive
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp - Check elements of array Y are consecutive
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i] - checkArrayY[i+1] == sectionSize) ||
                ((checkArrayY[i] - yCordinate == sectionSize) && (checkArrayY[i+1] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click - 1 square which player click 
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawXwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click.
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPiecesToWin; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPiecesToWin)
        {
            // Sắp xếp mảng X tăng dần
			// Sort array X increase
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            // Sắp xếp mảng Y giảm dần
			// Sort array Y decrease
            var min;
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] > checkArrayY[j-1])
                    {
                        min = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = min;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp - Check elements of array X are consecutive
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp - Check elements of array Y are consecutive
            // Nhớ đổi lại vì Y giảm dần
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i] - checkArrayY[i+1] == sectionSize) ||
                ((checkArrayY[i] - yCordinate == sectionSize) && (checkArrayY[i+1] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click - 1 square which player click
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại - other squares
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawOwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
}

/* ===================== New Game ===================== */

function newgame()
{
    location.reload();
}
