<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<body style="margin: 10px;">
	<div style="background:#FFF none repeat scroll 0% 0%;padding:30px;">
		<div style="max-width:70%; margin: 0px auto;">
			<div style="background-color:#387EF5;color:#fff; padding:2px 30px 2px 30px; margin:0px auto; font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
					<p>Time Entry Details</p>
			</div>
			<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;background:#fff; margin:0 auto; padding:30px;border:1px solid #e0e0e0;">
				<ul style="color: #302e2d;  padding: 0px; list-style-type: none; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);">
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px;"><p><i class="fa fa-angle-double-right"></i><strong>Client Name:</strong> <?php echo $client_name ?></p></li>	
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px;"><p><i class="fa fa-angle-double-right"></i><strong>Sent As:</strong> <?php echo ($sent_as == "Draft" ? "<span style='color:#FFC900'>Draft</span>":"<span style='color:#33CD5F'>Final</span>")?></p></li>
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px;"><p><i class="fa fa-angle-double-right"></i><strong>Length:</strong> <?php echo $units." unit, ". sprintf("%02d", $hours) .":". sprintf("%02d", $minutes) .":". sprintf("%02d", $seconds) ?></p></li>
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px;"><p><i class="fa fa-angle-double-right"></i><strong>Matter:</strong> <?php echo $matter ?></p></li>
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px;"><p><i class="fa fa-angle-double-right"></i><strong>Phase:</strong> <?php echo $phase ?></p></li>
					<li style="font-size: 16px;border-color: #DDD; border: 1px solid #DDD; background-color: #FFF;color: #444;padding-left: 15px; min-height: 200px; max-height: 100%;"><p><i class="fa fa-angle-double-right"></i><strong>Narration:</strong> <?php echo $narration ?></p></li>
				</ul>
			</div>
		</div>
	</div>
</body>