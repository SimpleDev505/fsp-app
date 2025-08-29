<style>
  .animation-container {
    position: relative;
    width: 400px;
    height: 200px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .icon-stage {
    position: relative;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    position: absolute;
    font-size: 48px;
    opacity: 0;
    transform: scale(0);
  }

  .icon.processing {
    color: var(--blue);
  }

  .icon.verified {
    color: var(--yellow);
  }

  .icon.security {
    color: var(--red);
  }

  .icon.success {
    color: var(--green);
  }

  .trail {
    position: absolute;
    width: 2px;
    height: 20px;
    background: linear-gradient(45deg, var(--blue), transparent);
    opacity: 0;
    border-radius: 2px;
  }

  .trail-1 {
    transform: rotate(15deg);
    top: 20px;
  }

  .trail-2 {
    transform: rotate(-15deg);
    top: 40px;
  }

  .trail-3 {
    transform: rotate(30deg);
    top: 30px;
  }

  .text-stage {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .text {
    position: absolute;
    font-size: var(--font-sm);
    font-weight: 500;
    opacity: 0;
    transform: translateX(-20px);
  }

  .text.processing {
    color: var(--blue);
  }

  .text.verified {
    color: var(--yellow);
  }

  .text.security {
    color: var(--red);
  }

  .text.success {
    color: var(--green);
  }

  .restart-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: var(--blue);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--font-s);
  }

  .restart-btn:hover {
    background: var(--blue-dark);
  }
</style>
