const grid = document.getElementById('grid');
    const multiplierEl = document.getElementById('multiplier');
    const messageEl = document.getElementById('message');
    const cashOutBtn = document.getElementById('cashOutBtn');
    const mineCountInput = document.getElementById('mineCount');
    const applySettingsBtn = document.getElementById('applySettingsBtn');
    const walletBalanceEl = document.getElementById('walletBalance');
    const betAmountInput = document.getElementById('betAmount');

    const gridSize = 5;
    const totalTiles = gridSize * gridSize;
    let mineCount = parseInt(mineCountInput.value, 10);
    let walletBalance = 100;
    let betAmount = parseInt(betAmountInput.value, 10);
    let mines = [];
    let revealedTiles = 0;
    let gameActive = true;

    function initGame() {
      if (betAmount > walletBalance) {
        alert("Insufficient balance. Please lower your bet amount.");
        return;
      }

      walletBalance -= betAmount;
      walletBalanceEl.textContent = walletBalance;

      mines = generateMines();
      grid.innerHTML = '';
      revealedTiles = 0;
      multiplierEl.textContent = '1x';
      messageEl.textContent = '';
      gameActive = true;

      for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        tile.addEventListener('click', handleTileClick);
        grid.appendChild(tile);
      }
    }

    function generateMines() {
      const minePositions = new Set();
      while (minePositions.size < mineCount) {
        const randomIndex = Math.floor(Math.random() * totalTiles);
        minePositions.add(randomIndex);
      }
      return Array.from(minePositions);
    }
    
    function handleTileClick(event) {
      if (!gameActive) return;

      const tile = event.target;
      const index = parseInt(tile.dataset.index, 10);

      if (tile.classList.contains('revealed')) return;

      if (mines.includes(index)) {
        tile.classList.add('mine');
        endGame(false);
      } else {
        tile.classList.add('revealed');
        revealedTiles++;
        updateMultiplier();

        if (revealedTiles === totalTiles - mineCount) {
          endGame(true);
        }
      }
    }

    function updateMultiplier() {
        const baseMultiplier = 1 + (mineCount * 0.05); // Base multiplier increases with mine count
        const currentMultiplier = (baseMultiplier + revealedTiles * 0.1).toFixed(2);
        multiplierEl.textContent = `${currentMultiplier}x`;
}


    function endGame(won) {
      gameActive = false;
      if (won) {
        const winnings = (betAmount * parseFloat(multiplierEl.textContent)).toFixed(2);
        walletBalance += parseFloat(winnings);
        walletBalanceEl.textContent = walletBalance;
        messageEl.textContent = `You won $${winnings}! 🎉`;
      } else {
        messageEl.textContent = 'You hit a mine! 💥';
      }
      revealMines();
    }

    function revealMines() {
      const tiles = document.querySelectorAll('.tile');
      tiles.forEach((tile, index) => {
        if (mines.includes(index)) {
          tile.classList.add('mine');
        }
        tile.removeEventListener('click', handleTileClick);
      });
    }

    cashOutBtn.addEventListener('click', () => {
      if (gameActive) {
        gameActive = false;
        const winnings = (betAmount * parseFloat(multiplierEl.textContent)).toFixed(2);
        walletBalance += parseFloat(winnings);
        walletBalanceEl.textContent = walletBalance;
        messageEl.textContent = `You cashed out with $${winnings}! 🤑`;
        revealMines();
      }
    });

    const addMoneyBtn = document.getElementById('addMoneyBtn');

    addMoneyBtn.addEventListener('click', () => {
      const addAmount = prompt("Enter the amount to add to your wallet:", "10");
      const amount = parseFloat(addAmount);
    
      if (!isNaN(amount) && amount > 0) {
        walletBalance += amount;
        walletBalanceEl.textContent = walletBalance;
        messageEl.textContent = `Successfully added $${amount.toFixed(2)} to your wallet! 🎉`;
      } else {
        alert("Invalid amount entered. Please enter a valid number.");
      }
    });
    

    applySettingsBtn.addEventListener('click', () => {
      mineCount = parseInt(mineCountInput.value, 10);
      betAmount = parseInt(betAmountInput.value, 10);

      if (mineCount < 1 || mineCount >= totalTiles) {
        alert("Invalid number of mines. Please choose between 1 and 24.");
        return;
      }

      if (betAmount < 1 || betAmount > walletBalance) {
        alert("Invalid bet amount. Please ensure it is within your wallet balance.");
        return;
      }

      initGame();
    });

    initGame();