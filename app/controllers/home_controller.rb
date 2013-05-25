class HomeController < ApplicationController
  def index
    @body_class = "main_body"
  end

  def thanks
    @body_class = "thanks_body"
  end

  #this method will attempt to subscribe the user
  def subscribe
    gb     = Gibbon.new
    @email = params[:EMAIL]
    @lists = gb.lists({:start => 0, :limit=> 100})
    status = 1

    respond_to do |format|
      if valid_email? @email

        #does this email exists in our list already?
        user_info = gb.listMemberInfo({:id => '82f2bd1a58',  :email_address => @email})
        resend_link = "<a class='resendMail' data-email='#{@email}' data-link='/revalidate' href='#'>Re-send validation E-mail</a>"

        if user_info["success"] == 1
          #pending user?
          user_status = user_info["data"][0]["status"]

          if user_status == "pending"
            status = 2
            message = "You've already signed up! Please check your email to confirm your subscription. #{resend_link}"
          else
            message = "You are already subscribed"
          end
        else
          # attempt to subscribe the user
          result = gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email})
          message = "Thanks! We've sent you an email!"
        end

      else
        status = 0
        message = "Invalid E-mail"
      end
      format.json { render :json => { email: @email, status: status, message: message } }
    end
  end

  #this method will resend the validation email to a given address
  def revalidate
    @email = params[:email]

    respond_to do |format|
      if valid_email? @email
        gb  = Gibbon.new
        gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email, :double_optin => true})
        status = 1
        message = "Thanks! We've sent you an email!"
      else
        status = 0
        message = "Invalid E-mail"
      end
      format.json { render :json => { email: @email, status: status, message: message } }
    end
  end

  private
  #method will validate a given email address
  def valid_email?(email)
    valid_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    (email.present? && email =~ valid_regex)
  end
end