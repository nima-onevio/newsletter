class HomeController < ApplicationController
  def index
    @body_class = "main_body"
  end
  def thanks
    @body_class = "thanks_body"
  end
end
