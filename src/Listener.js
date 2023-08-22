class Listener {
  constructor(mailSender, playlistsService) {
    this._mailSender = mailSender;
    this._playlistsService = playlistsService;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    const { playlistId, targetEmail } = JSON.parse(message.content.toString());
    const playlist = await this._playlistsService.findById(playlistId);
    const result = await this._mailSender.sendEmail(
      targetEmail,
      JSON.stringify({ playlist })
    );

    console.info(result);
  }
}

module.exports = Listener;
