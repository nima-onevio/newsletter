class HomeController < ApplicationController
  def index
    @body_class = "main_body"
  end

  def thanks
    @body_class = "thanks_body"
  end

  def subscribe
    gb     = Gibbon.new
    @email = params[:EMAIL]
    @lists = gb.lists({:start => 0, :limit=> 100})

    respond_to do |format|
      if valid_email? @email

        #does this email exists in our list already?
        user_info = gb.listMemberInfo({:id => '82f2bd1a58',  :email_address => @email})

        resend_link = "<a class='resendMail' data-email='#{@email}' data-link='/revalidate' href='#'>Re-send validation E-mail</a>"

        if user_info["success"] == 1
          #pending user?
          user_status = user_info["data"][0]["status"]

          if user_status == "pending"
            format.json { render :json => { email: @email, status: 2, message: "You've already signed up! Please check your emails to confirm your subscription. #{resend_link}", info: user_info} }
          else
            format.json { render :json => { email: @email, status: 0, message: "You are already subscribed", info: user_info} }
          end

        else
          # attempt to subscribe the user
          result = gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email})
          format.json { render :json => { email: @email, status: 1, message: "We've sent you an E-mail!", info: result } }
        end

      else
        format.json { render :json => { email: @email, status: 0, message: "Invalid E-mail" } }
      end
    end
  end

  def revalidate
    @email = params[:email]

    respond_to do |format|
      if valid_email? @email
        gb  = Gibbon.new
        gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email, :double_optin => true})
        format.json { render :json => { email: @email, status: 1, message: "Email validation sent, please check your email" } }
      else
        format.json { render :json => { email: @email, status: 0, message: "Invalid E-mail" } }
      end
    end
  end

  private
  #method will validate a given email address
  def valid_email?(email)
    valid_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    (email.present? && email =~ valid_regex)
  end
end