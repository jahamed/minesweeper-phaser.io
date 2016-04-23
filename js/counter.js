var Counter = function (x, y, defaultValue) {
    var currentValue = defaultValue;
    var tf_counter = game.add.text(x, y, "Mines: " + defaultValue, fontStyles.counterFontStyle);
    tf_counter.anchor.set(1, 0.5);
    
    this.update = function (value) {
        tf_counter.text = "Mines: " + (currentValue - value);
    }
}