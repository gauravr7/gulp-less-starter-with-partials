var stage,
    sunShape,
    appNode,
    angle,
    appNodeCollection,
    nodeRadius = 70,
    leafNodeSize = 44,
    nodeDistance = 200,
    leafNodeCount = 8,
    canvasCenter,
    placementData = [],
    lineCollection,
    leafCollection,
    appNode,
    fadeBgContainer,
    controlMenu,
    canvasTooltip,
    flowCollection,
    flowDocCollection,
    colors = {
        centerNodeFill: '#0075cc',
        centerNodeBorder: '#e6e6e6',
        leafNodeFill: '#fff',
        leafNodeBorder0: '#427cac', // fixeer
        leafNodeBorder1: '#ffb400', //ups
        leafNodeBorder2: '#019ecd', // nexmo
        leafNodeBorder3: '#ffe430', // expensify
        leafNodeBorder4: '#002b8a', // paypal
        leafNodeBorder5: '#f3802b', //magento
        leafNodeBorder6: '#818181', // shopify
        leafNodeBorder7: '#fbc067' // amazon market
    },
    images = {
        sapLogo: "../img/landscape/OE.sap-landscape.png",
        img0: "../img/landscape/OE.wechat-landscape.png",
        img1: "../img/landscape/OE.whatsapp-landscape.png",
        img2: "../img/landscape/OE.adp-landscape.png",
        img3: "../img/landscape/OE.aqc-landscape.png",
        img4: "../img/landscape/OE.dhl-landscape.png",
        img5: "../img/landscape/OE.whatsapp-landscape.png",
        img6: "../img/landscape/OE.shopify-landscape-notdeployed.png",
        img7: "../img/landscape/OE.intercompany-landscape.png"
    };

function tickHandler() {
    stage.update();
}

function LeafNodeConstructor(posX, posY, index) {
    var text,
        leafNode = new createjs.Container();

    centerShape = new createjs.Shape();
    centerShape.graphics.beginFill(colors['leafNodeBorder' + index]);
    centerShape.graphics.drawCircle(0, 0, leafNodeSize);
    centerShape.graphics.beginFill(colors.leafNodeFill);
    centerShape.graphics.drawCircle(0, 0, leafNodeSize - 2);
    centerShape.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.2)", 0, 0, 8); // ( color  offsetX  offsetY  blur )
    leafNodeLogo = new createjs.Bitmap(images['img' + index]);
    leafNodeLogo.scale = 0.65;
    leafNodeLogo.x = -45;
    leafNodeLogo.y = -45;
    leafNode.name = 'leafNode' + index;
    leafNode.addChild(centerShape, leafNodeLogo);
    leafNode.x = posX;
    leafNode.y = posY;
    leafNode.on("rollover", function (evt) {
        $('#canvas-tooltip').text(evt.target.name);
        canvasTooltip.x = evt.stageX;
        canvasTooltip.y = evt.stageY;
        canvasTooltip.visible = true;
        
    });
    leafNode.on("rollout", function (evt) {
        canvasTooltip.visible = false;
    });
    leafNode.on("click", function (evt) {
        if (evt.nativeEvent.which === 1) {
            console.log('leafNode left click');
        }
        if (evt.nativeEvent.which === 3) {
            console.log('leafNode right click');
            $('.menuAppName').text(evt.target.parent.name);
            controlMenu.x = evt.stageX;
            if ((evt.stageY + controlMenu.htmlElement.offsetHeight) > 460) {
                controlMenu.y = evt.stageY - controlMenu.htmlElement.offsetHeight;
            } else {
                controlMenu.y = evt.stageY;
            }
            canvasTooltip.visible = false;
            controlMenu.visible = true;
            fadeBgContainer.visible = true;
        }
    })
    leafNode.on("pressmove", function (evt) {
        evt.currentTarget.x = evt.stageX;
        evt.currentTarget.y = evt.stageY;
        stage.update();

        var currentLine = lineCollection.getChildAt(index);
        stage.update();

        var gradColors = [colors.centerNodeFill, colors['leafNodeBorder' + index]],
            ratios = [0.40, 0.75],
            x0 = 0,
            y0 = 0,
            x1 = evt.stageX - appNode.x,
            y1 = evt.stageY - appNode.y;

        currentLine.graphics.clear()
            .beginLinearGradientStroke(gradColors, ratios, x0, y0, x1, y1) // ( colors-ratios, x0, y0, x1, y1 )
            .setStrokeStyle(15, "round")
            .setStrokeDash([0, 20], 0)
            .mt(0, 0).lt(x1, y1);
        updatePlacementData();
        evt.stopPropagation();
    })
    leafNode.on("mousedown", function (evt) {
        evt.currentTarget.offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
    })
    leafNode.on("pressup", function (evt) {
        var obj = {
            x: this.x,
            y: this.y
        }
        console.log('pressup', obj);
    });
    
    return leafNode;
}

function drawLines() {
    lineCollection.removeAllChildren();
    placementData.forEach(function (element, index) {
        var gradColors = [colors.centerNodeFill, colors['leafNodeBorder' + index]],
            ratios = [0.40, 0.75],
            x0 = 0,
            y0 = 0,
            x1 = placementData[index].x - canvasCenter.x,
            y1 = placementData[index].y - canvasCenter.y;

        var line = new createjs.Shape();
        line.graphics.clear()
            .beginLinearGradientStroke(gradColors, ratios, x0, y0, x1, y1) // ( colors-ratios, x0, y0, x1, y1 )
            .setStrokeStyle(15, "round")
            .setStrokeDash([0, 20], 0)
            .mt(0, 0).lt(x1, y1);
        line.alpha = 0.75;
        lineCollection.addChild(line);
    })
    return lineCollection;
}

function updatePlacementData() {
    placementData = [];
    leafCollection.children.forEach(function (element, index) {
        var positionXY = {
            x: element.x,
            y: element.y
        };
        placementData.push(positionXY);
        console.log(index);
    })
    console.log('placementData new', placementData);
}

function CenterNodeConstructor() {
    var centerNodeLogo,
        text,
        centerCombineShp = new createjs.Container();

    centerShape = new createjs.Shape();
    centerShape.graphics.beginFill(colors.centerNodeBorder);
    centerShape.graphics.drawCircle(0, 0, nodeRadius);
    centerShape.graphics.beginFill(colors.centerNodeFill);
    centerShape.graphics.drawCircle(0, 0, nodeRadius - 10);
    centerShape.graphics.endFill();
    centerNodeLogo = new createjs.Bitmap(images.sapLogo);
    centerNodeLogo.scale = 0.08;
    centerNodeLogo.x = -45;
    centerNodeLogo.y = -20;

    text = new createjs.Text('Integration Hub', "12px Arial", "#ffffff");
    text.textAlign = 'center';
    text.x = 0;
    text.y = 10;

    centerCombineShp.addChild(centerShape, text);
    centerCombineShp.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.5)", 0, 2,
        15); // ( color  offsetX  offsetY  blur )
    centerCombineShp.cache(-70, -70, 140, 140);

    lineCollection = drawLines();
    flowDocCollection = drawFlowDocs();
    appNode.addChild(lineCollection, flowDocCollection, centerCombineShp, centerNodeLogo);
    appNode.x = canvasCenter.x;
    appNode.y = canvasCenter.y;

    appNode.on("pressmove", function (evt) {
        // Calculate the new X and Y based on the mouse new position plus the offset.
        evt.currentTarget.x = evt.stageX + evt.currentTarget.offset.x;
        evt.currentTarget.y = evt.stageY + evt.currentTarget.offset.y;

        // update latest placement data
        updatePlacementData();

        for (var x = 0; x < leafCollection.children.length; x++) {
            var currentLine = lineCollection.getChildAt(x);
            var gradColors = [colors.centerNodeFill, colors['leafNodeBorder' + x]],
                ratios = [0.40, 0.75],
                x0 = 0,
                y0 = 0,
                x1 = placementData[x].x - this.x,
                y1 = placementData[x].y - this.y;

            currentLine.graphics.clear()
                .beginLinearGradientStroke(gradColors, ratios, x0, y0, x1, y1) // ( colors-ratios, x0, y0, x1, y1 )
                .setStrokeStyle(15, "round")
                .setStrokeDash([0, 20], 0)
                .mt(0, 0).lt(x1, y1);
            evt.stopPropagation();
        }
        stage.update();
    })

    appNode.on("mousedown", function (evt) {
        console.log('mousedown');
        evt.currentTarget.offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
    })

    appNode.on("pressup", function (evt) {
        console.log('pressup center', this.x, this.y);
    });

    return appNode;
}

function createPlacementData() {
    var appAngle = 2 * Math.PI;
    startAngle = 0; //Math.PI/2;
    eachAngle = appAngle / leafNodeCount;
    for (var i = 0; i < leafNodeCount; i++) {
        console.log('index', i);
        var x = Math.cos(startAngle + eachAngle * i) * nodeDistance + canvasCenter.x,
            y = Math.sin(startAngle + eachAngle * i) * nodeDistance + canvasCenter.y,
            positionXY;
        positionXY = {
            x,
            y
        };
        placementData.push(positionXY);
    }
    console.log('placementData: ', placementData);
}

function drawFlowDocs() {
    var docShape = new createjs.Graphics();
    docShape.beginFill('#f90');
    docShape.drawCircle(0, 0, 20);
    docShape.beginFill('#fff');
    docShape.drawRect(-10, -10, 20, 4);
    docShape.drawRect(-10, -2, 20, 4);
    docShape.drawRect(-10, 6, 20, 4);

    for (var i = 1; i <= leafNodeCount; i++) {
        flowCollection.addChild(new createjs.Shape(docShape));
    }
    flowCollection.x = flowCollection.y = -15;
    return flowCollection;
}

function animateFlowDocs() {
    flowDocCollection.alpha = 1;
    flowDocCollection.children.forEach(function (element, index) {
        createjs.Tween.get(element)
            .to({
                alpha: 1
            }, 10)
            .to({
                guide: {
                    path: [25, 25,
                        placementData[index].x - appNode.x - 150, placementData[index].y -
                        appNode.y - 150,
                        placementData[index].x - appNode.x, placementData[index].y - appNode.y
                    ]
                }
            }, 1250 + index * 750, createjs.Ease.quadInOut)
            .wait(50)
            .to({
                alpha: 0
            }, 500, createjs.Ease.quadInOut)
    });
}

function setupLandscape() {
    leafCollection = new createjs.Container();
    placementData.forEach(function (element, index) {
        console.log('element-' + index, element);
        var leafNode = new LeafNodeConstructor(element.x, element.y, index);
        leafCollection.addChild(leafNode);
    });
    appNodeCollection.addChild(leafCollection);
    stage.update();

    var fadeBg = new createjs.Shape();
    fadeBg.graphics.beginFill('rgba(255,255,255, 0.5)');
    fadeBg.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    fadeBgContainer.visible = false;

    fadeBgContainer.on("mousedown", function (evt) {
        console.log('bg clicked');
        evt.stopPropagation();
        if (controlMenu.isVisible) {
            fadeBgContainer.visible = false;
            controlMenu.visible = false;
        };
    });
    fadeBgContainer.addChild(fadeBg);
}

function resetCanvas() {
    console.log('Canvas cleared');
    stage.clear = true;

    stage = null,
        sunShape = null,
        appNode = null,
        angle = null,
        appNodeCollection = null,
        canvasCenter = null,
        placementData = [],
        lineCollection = null,
        leafCollection = null,
        appNode = null,
        flowCollection = null,
        flowDocCollection = null;
    init();
}

function init() {
    document.getElementById('stage-canvas').width = $('.ih-app-connections-content').outerWidth();
    document.getElementById('stage-canvas').height = 500;
    stage = new createjs.Stage("stage-canvas");
    stage.enableMouseOver(10);
    createjs.MotionGuidePlugin.install(createjs.Tween);
    appNode = new createjs.Container();
    appNodeCollection = new createjs.Container();
    lineCollection = new createjs.Container();
    fadeBgContainer = new createjs.Container();
    flowDocCollection = new createjs.Container();
    flowCollection = new createjs.Container();

    $('.ih-app-connections-content').on('contextmenu', '#stage-canvas', function (e) {
        return false;
    });

    controlMenu = new createjs.DOMElement("ih-landscape-control-menu");
    controlMenu.regX = -20;
    controlMenu.regY = -40;
    controlMenu.visible = false;

    canvasTooltip = new createjs.DOMElement("canvas-tooltip");
    canvasTooltip.regX = -10;
    canvasTooltip.regY = -10;
    canvasTooltip.visible = false;

    canvasCenter = {
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2
    }

    if (leafNodeCount > 0) createPlacementData();
    var obj = new CenterNodeConstructor();

    appNodeCollection.addChild(obj);
    stage.addChild(appNodeCollection, fadeBgContainer, controlMenu, canvasTooltip);
    setupLandscape();
    //Rotate the starting position for the container
    // if (leafNodeCount === 3) {
    //     appNodeCollection.regX = appNodeCollection.regY = 285;
    //     appNodeCollection.rotation = 90;
    //     appNodeCollection.x = appNodeCollection.y = 285;
    // }
    document.getElementById('stage-canvas').width = $('.ih-app-connections-content').outerWidth();
    document.getElementById('stage-canvas').height = 500;
    stage.update();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', tickHandler);
}
window.onload = init;